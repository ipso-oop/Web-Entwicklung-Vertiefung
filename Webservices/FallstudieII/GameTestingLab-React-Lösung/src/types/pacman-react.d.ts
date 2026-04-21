declare module 'pacman-react' {
  import { FC } from 'react';

  interface PacmanProps {
    size?: number;
    color?: string;
    mouthOpen?: number;
    direction?: number;
  }

  const Pacman: FC<PacmanProps>;
  export default Pacman;
} 