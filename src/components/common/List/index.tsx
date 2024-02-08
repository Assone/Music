import { attachPropertiesToComponent } from '@/utils/react';
import ListContainer from './Container';
import ListItem from './Item';

export type { ListContainerProps as ListProps } from './Container';
export type { ListItemProps } from './Item';

export default attachPropertiesToComponent(ListContainer, {
  Item: ListItem,
});
