import styles from './lib-ui.module.css';

/* eslint-disable-next-line */
export interface LibUiProps {}

export function LibUi(props: LibUiProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to LibUi!</h1>
    </div>
  );
}

export default LibUi;
