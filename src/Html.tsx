import { PropsWithChildren } from "react";
import IF from "./components/common/IF";

interface HtmlProps {
  head?: string;
}

const Html: React.FC<PropsWithChildren<HtmlProps>> = ({ head, children }) => (
  <html lang="en">
    {/* eslint-disable-next-line react/no-danger */}
    <head dangerouslySetInnerHTML={head ? { __html: head } : undefined} />
    <body>
      <div id="root">{children}</div>
      <IF condition={import.meta.env.DEV}>
        <script type="module" src="/src/entry-client.tsx" />
      </IF>
    </body>
  </html>
);

export default Html;
