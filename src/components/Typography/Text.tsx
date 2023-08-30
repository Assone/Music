import { PropsWithChildren } from 'react';

export interface TextProps {}

const Text: React.FC<PropsWithChildren<TextProps>> = ({ children }) => (
  <span>{children}</span>
);

export default Text;
