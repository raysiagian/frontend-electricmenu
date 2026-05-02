import clsx from 'clsx';
import styles from './Button.module.css';

export const Button = ({
    children,
    variant = 'primary',  // primary | outline | ghost
    size = 'md',          // sm | md | lg
    full = false,
    onClick,
    type = 'button',
    }) => (
    <button
        type={type}
        onClick={onClick}
        className={clsx(
        styles.btn,
        styles[variant],   // styles.primary / styles.outline / styles.ghost
        styles[size],      // styles.sm / styles.md / styles.lg
        full && styles.full
        )}
    >
        {children}
    </button>
);