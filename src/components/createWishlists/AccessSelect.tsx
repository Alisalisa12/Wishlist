import styles from "../../pages/CreateWishlists/CreateWishlists.module.scss";
import React from "react";


interface AccessSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const AccessSelect: React.FC<AccessSelectProps> = ({ value, onChange }) => (
  <div>
    <select value={value} onChange={onChange} id="access" name="access" defaultValue="">
      <option value="" disabled selected hidden>
        Настройки доступа
      </option>
      <option className={styles.option} value="public" id="public">
        Виден всем
      </option>
      <option className={styles.option} value="private" id="private">
        Виден только мне
      </option>
      <option className={styles.option} value="friends" id="friends">
        Виден друзьям
      </option>
      <option className={styles.option} value="link" id="link">
        Доступен только по ссылке
      </option>
    </select>
  </div>
);

export default AccessSelect;