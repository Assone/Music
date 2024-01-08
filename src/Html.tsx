import { PropsWithChildren } from "react";

interface HtmlProps {
  head?: string;
}

const Html: React.FC<PropsWithChildren<HtmlProps>> = ({ head, children }) => (
  <html lang="en">
    {/* eslint-disable-next-line react/no-danger */}
    <head dangerouslySetInnerHTML={head ? { __html: head } : undefined} />
    <body>
      <div id="root">{children}</div>
      <script type="module" src="/src/entry-client.tsx" />
    </body>
  </html>
);

export default Html;
