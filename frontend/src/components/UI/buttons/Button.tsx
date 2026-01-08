import styles from "./Button.module.scss";
import clsx from "clsx";
import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right"; 
}

const Button: React.FC<ButtonProps> = React.memo(({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className,
  disabled = false,
  icon,
  iconPosition = "left",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(className, styles.button, styles[variant] )}
    >
      {icon && iconPosition === "left" && (
        <span className={styles.icon}>{icon}</span>
      )}
      {children !== undefined && children !== null && (
        <span>{children}</span>
      )}
      {icon && iconPosition === "right" && (
        <span className={styles.icon}>{icon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
