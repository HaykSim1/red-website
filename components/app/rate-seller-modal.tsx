"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/app/ui/button";
import { TextAreaField } from "@/components/app/ui/field";
import { Modal } from "@/components/app/ui/modal";
import { StarPicker } from "@/components/app/ui/star-rating";
import { Alert } from "@/components/app/ui/states";
import { apiJson } from "@/lib/app/api-client";
import { translateApiError } from "@/lib/app/error-msg";

/**
 * Shared by the shop profile and by a closed deal on the request detail page.
 *
 * POST /ratings keys on seller_id, not on the request — one rating per
 * (buyer, seller) pair within the API's 10-day cooldown, which is why a repeat
 * submission comes back as an error rather than silently replacing the old score.
 */
export function RateSellerModal({
  open,
  onClose,
  sellerId,
  onRated,
}: {
  open: boolean;
  onClose: () => void;
  sellerId: string;
  onRated?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const rateM = useMutation({
    mutationFn: () =>
      apiJson("/ratings", {
        method: "POST",
        body: JSON.stringify({
          seller_id: sellerId,
          score,
          ...(comment.trim() ? { comment: comment.trim() } : {}),
        }),
      }),
    onSuccess: () => {
      setComment("");
      setError(null);
      void queryClient.invalidateQueries({ queryKey: ["shop", sellerId] });
      void queryClient.invalidateQueries({ queryKey: ["shops", "featured"] });
      onRated?.();
      onClose();
    },
    onError: (e) => setError(translateApiError(e, i18n)),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("shop.writeReview")}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button loading={rateM.isPending} onClick={() => rateM.mutate()}>
            {t("shop.submitReview")}
          </Button>
        </>
      }
    >
      {error ? (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      ) : null}
      <StarPicker value={score} onChange={setScore} label={t("shop.reviewScoreLabel")} />
      <TextAreaField
        className="mt-4"
        label={t("shop.reviewCommentLabel")}
        placeholder={t("shop.reviewCommentPlaceholder")}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
      />
    </Modal>
  );
}
