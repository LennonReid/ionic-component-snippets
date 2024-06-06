export interface TreeNode<T> {
  id: string;
  name: string;
  children: T[];
  expanded: boolean;
  selected: boolean;
}
