import { TreeNode } from '../interfaces/tree-node';
import { ArrayDataSource, SelectionModel } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectorRef, inject } from '@angular/core';

export abstract class TreeBase<T extends TreeNode<T>> {
  private _selectedItem!: T;
  private _treeData!: ArrayDataSource<T>;
  public treeControl: NestedTreeControl<T>;
  public selectionModel: SelectionModel<T>;
  cdr = inject(ChangeDetectorRef);

  private parentMap = new Map<T, T | null>();

  constructor(multiSelect = true) {
    this.treeControl = new NestedTreeControl<T>((node) => <T[]>node.children);
    this.selectionModel = new SelectionModel(multiSelect);
  }

  public hasChild = (_: number, node: T) =>
    !!node.children && node.children.length > 0;
  public isSelected = (node: T) => this.selectionModel.isSelected(node);
  public isExpanded = (node: T) => node.expanded;

  public get treeData() {
    return this._treeData;
  }
  public set treeData(data: ArrayDataSource<T>) {
    this._treeData = data;
    this.initializeParentMap(data['_data']);
  }

  public get selectedItem(): T {
    return this._selectedItem;
  }
  public set selectedItem(v: T) {
    this._selectedItem = v;
  }

  /** 初始化父节点映射 */
  private initializeParentMap(nodes: T[], parent: T | null = null) {
    nodes.forEach((node) => {
      this.parentMap.set(node, parent);
      if (node.children) {
        this.initializeParentMap(node.children, node);
      }
    });
  }

  public descendantsAllSelected(node: T): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const allSelected = descendants.every((child) =>
      this.selectionModel.isSelected(child)
    );
    node.selected = allSelected;
    return allSelected;
  }

  public descendantsPartiallySelected(node: T): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.selectionModel.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  public parentSelectionToggle(node: T): void {
    const isSelected = !this.selectionModel.isSelected(node);
    this.selectionModel.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    if (isSelected) {
      this.selectionModel.select(...descendants);
    } else {
      this.selectionModel.deselect(...descendants);
    }
    this.cdr.detectChanges();
  }

  public clickNode(node: T): void {
    const isSelected = node.selected;
    const descendants = this.treeControl.getDescendants(node);

    if (isSelected) {
      this.selectionModel.select(node);
      descendants.forEach((d) => {
        d.selected = true;
        this.selectionModel.select(d);
      });
    } else {
      this.selectionModel.deselect(node);
      descendants.forEach((d) => {
        d.selected = false;
        this.selectionModel.deselect(d);
      });
    }
    this.updateParentSelection(node);
  }

  private updateParentSelection(node: T): void {
    let parent = this.parentMap.get(node);
    while (parent) {
      const descendants = this.treeControl.getDescendants(parent);
      const allSelected = descendants.every((d) => d.selected);
      if (allSelected) {
        parent.selected = true;
        this.selectionModel.select(parent);
      } else {
        parent.selected = false;
        this.selectionModel.deselect(parent);
      }
      parent = this.parentMap.get(parent);
    }
  }
}
