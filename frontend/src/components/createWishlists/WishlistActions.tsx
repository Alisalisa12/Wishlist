import styles from "../WishlistContent/WishlistContent.module.scss";
import Button from "../UI/buttons/Button";
import { Share2, Plus, Trash2, PencilLine } from "lucide-react";
import React from "react";
import useMedia from "use-media";

interface WishlistActionsProps {
  onAddWish: () => void;
  onDeleteMode: () => void;
  onEditWish?: () => void;
  onShare?: () => void;
  canEdit?: boolean;
  onDeleteList?: () => void;
  isOwner?: boolean; // необязательный
}

const WishlistActions: React.FC<WishlistActionsProps> = React.memo(({
  onAddWish,
  onDeleteMode,
  onEditWish,
  onShare,
  isOwner = false,
}) => {
  const isMobile = useMedia({ maxWidth: "730px" });

  if (!isOwner) return null;

  return (
    <div className={styles.actions}>
      <Button icon={<Plus size={18} />} onClick={onAddWish}>
        {!isMobile && "Добавить"}
      </Button>

      <Button
        icon={<PencilLine size={18} />}
        onClick={onEditWish}
        disabled={!onEditWish}
      >
        {!isMobile && "Редактировать"}
      </Button>

      <Button icon={<Trash2 size={18} />} onClick={onDeleteMode}>
        {!isMobile && "Удалить"}
      </Button>

      <Button icon={<Share2 size={18} />} onClick={onShare}>
        {!isMobile && "Поделиться"}
      </Button>
    </div>
  );
});

WishlistActions.displayName = 'WishlistActions';

export default WishlistActions;