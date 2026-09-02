/**
 * NHTSA vPIC public API — decode VIN to Make / Model / Year / engine hints.
 * @see https://vpic.nhtsa.dot.gov/api/
 */

const VPIC_DECODE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin';

export interface VpicResultItem {
  Value: string | null;
  ValueId?: string | null;
  Variable: string;
  VariableId?: number;
}

export interface VpicDecodeResponse {
  Count?: number;
  Message?: string;
  SearchCriteria?: string;
  Results?: VpicResultItem[];
}

function getVariableValue(results: VpicResultItem[], variable: string): string {
  const row = results.find((r) => r.Variable === variable);
  const v = row?.Value;
  if (v == null) return '';
  return String(v).trim();
}

function buildEngineSummary(results: VpicResultItem[]): string {
  const liters = getVariableValue(results, 'Displacement (L)');
  const ci = getVariableValue(results, 'Displacement (CI)');
  const cyl = getVariableValue(results, 'Engine Number of Cylinders');
  const fuel = getVariableValue(results, 'Fuel Type - Primary');
  const parts: string[] = [];
  if (liters) parts.push(`${liters} L`);
  else if (ci) parts.push(`${ci} cu in`);
  if (cyl) parts.push(`${cyl} cyl`);
  if (fuel) parts.push(fuel);
  return parts.join(', ');
}

export type VpicDecodeOk = {
  ok: true;
  brand: string;
  model: string;
  year: string;
  engine: string;
};

export type VpicDecodeErr = {
  ok: false;
  messageKey: 'network' | 'empty' | 'invalid' | 'api';
  detail?: string;
};

export type VpicDecodeResult = VpicDecodeOk | VpicDecodeErr;

const VIN_MIN_LEN = 11;

/**
 * Calls VPIC `GET /vehicles/decodevin/{vin}?format=json` and maps fields for our vehicle form.
 */
export async function decodeVinFromVpic(vinRaw: string): Promise<VpicDecodeResult> {
  const vin = vinRaw.trim().toUpperCase().replace(/\s/g, '');
  if (vin.length < VIN_MIN_LEN) {
    return { ok: false, messageKey: 'invalid', detail: 'short' };
  }

  const url = `${VPIC_DECODE_URL}/${encodeURIComponent(vin)}?format=json`;
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    return { ok: false, messageKey: 'network' };
  }

  if (!res.ok) {
    return { ok: false, messageKey: 'network', detail: String(res.status) };
  }

  let data: VpicDecodeResponse;
  try {
    data = (await res.json()) as VpicDecodeResponse;
  } catch {
    return { ok: false, messageKey: 'api' };
  }

  /** All decoded keys/values live here (Make, Model, Error Code, etc.). */
  const results = data.Results;
  if (!results?.length) {
    return { ok: false, messageKey: 'empty' };
  }

  const errorCode = getVariableValue(results, 'Error Code');
  const errorText =
    getVariableValue(results, 'Error Text') ||
    getVariableValue(results, 'Additional Error Text') ||
    '';
  const hasVpicError = errorCode !== '' && errorCode !== '0';

  const brand = getVariableValue(results, 'Make');
  if (!brand) {
    if (hasVpicError) {
      return {
        ok: false,
        messageKey: 'api',
        detail: errorText || `Error Code ${errorCode}`,
      };
    }
    return { ok: false, messageKey: 'empty' };
  }

  let model = getVariableValue(results, 'Model');
  const trim = getVariableValue(results, 'Trim');
  if (trim && model && !model.toLowerCase().includes(trim.toLowerCase())) {
    model = `${model} ${trim}`.trim();
  } else if (!model && trim) {
    model = trim;
  }

  const yearRaw = getVariableValue(results, 'Model Year');
  const year = yearRaw.replace(/\D/g, '').slice(0, 4);

  const engine = buildEngineSummary(results);

  // NHTSA often sets Error Code ≠ 0 (e.g. check digit) while Make/Model/Year are still valid.
  // We do not surface that text in the UI after a successful autofill.

  return {
    ok: true,
    brand,
    model,
    year,
    engine,
  };
}
