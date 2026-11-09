import {type FC, type ReactNode} from "react";

type CellProps = {
  children: ReactNode;
  onClick?: VoidFunction;
};

const Cell: FC<CellProps> & {
  LeftContent: typeof LeftContent;
  Content: typeof Content;
  RightContent: typeof RightContent;
} = ({children}) => {
  return <div className="flex items-center gap-3 w-full">{children}</div>;
};

type LeftContentProps = {
  children: ReactNode;
};

const LeftContent: FC<LeftContentProps> = props => {
  return <div {...props} />;
};

type RightContentProps = {
  children: ReactNode;
};

const RightContent: FC<RightContentProps> = props => {
  return <div {...props} />;
};

type ContentProps = {
  children: ReactNode;
};

const Content: FC<ContentProps> & {Title: typeof Title; Subtitle: typeof Subtitle} = props => {
  return <div {...props} className="flex flex-col flex-1 min-w-0" />;
};

type ContentTitleProps = {
  children: ReactNode;
};
const Title: FC<ContentTitleProps> = props => {
  return <p className="text-sm font-medium truncate" {...props} />;
};
type ContentSubtitleProps = {
  children: ReactNode;
};
const Subtitle: FC<ContentSubtitleProps> = props => {
  return <p {...props} className="text-xs text-muted-foreground truncate" />;
};

Cell.LeftContent = LeftContent;
Cell.RightContent = RightContent;
Content.Title = Title;
Content.Subtitle = Subtitle;
Cell.Content = Content;

export {Cell};
