# ion-cdk-tree-select

An Angular component that combines the power of Angular CDK Tree and Ionic components to create a customizable, tree-structured selection list. It allows for dynamic icon sizes, font sizes, and style customizations, making it suitable for a wide range of applications.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
  - [Using with NgModule](#using-with-ngmodule)
  - [Using as a Standalone Component](#using-as-a-standalone-component)
- [API Reference](#api-reference)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
- [Styling](#styling)
  - [Overriding Default Styles](#overriding-default-styles)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Features

- Tree-structured selection using Angular CDK Tree
- Integration with Ionic components for a modern UI
- Customizable icon sizes and font sizes via `@Input` properties
- Ability to specify custom icons for expanded and collapsed states
- Supports both NgModule and standalone component usage
- Emits selection changes through an event emitter

## Demo

[Live Demo Link](https://ionic-component-snippets.vercel.app/tree-select)

## Installation

Install the package via NPM:

```bash
npm install ion-cdk-tree-select
```

## Usage

### Using with NgModule

#### 1. Import the Module

In your `app.module.ts`, import `IonCdkTreeSelectModule`:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonCdkTreeSelectModule } from 'ion-cdk-tree-select';
import { IonicModule } from '@ionic/angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), IonCdkTreeSelectModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

#### 2. Use the Component in Templates

In your component template:

```html
<cdk-tree-select
  [data]="treeData"
  [iconSize]="'large'"
  [fontSize]="'16px'"
  (selectChangeEvent)="onSelectChange($event)"
></cdk-tree-select>
```

#### 3. Provide Data and Event Handlers

In your component class:

```typescript
import { Component } from '@angular/core';
import { TodoItem } from 'ion-cdk-tree-select';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
})
export class HomePage {
  treeData: TodoItem[] = [
    { id: 1, name: 'Furniture' },
    { id: 2, name: 'Tables', parentId: 1 },
    // ... more data
  ];

  onSelectChange(selectedItems: TodoItem[]) {
    console.log('Selected items:', selectedItems);
  }
}
```

### Using as a Standalone Component

#### 1. Import the Component Directly

In your component file, import `CdkTreeSelectComponent` and necessary Ionic modules:

```typescript
import { Component } from '@angular/core';
import { CdkTreeSelectComponent, TodoItem } from 'ion-cdk-tree-select';
import {
  IonicModule,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonicModule,
    CdkTreeSelectComponent,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
  ],
  templateUrl: 'home.page.html',
})
export class HomePage {
  // Same as before
}
```

#### 2. Use the Component in Templates

Same as in the NgModule version.

## API Reference

### Inputs

| Input               | Type                                            | Default             | Description                                                                                                                 |
| ------------------- | ----------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `data`              | `TodoItem[]`                                    | `[]`                | The data source for the tree.                                                                                               |
| `buttonSize`        | `'default'` \| `'large'` \| `'small'` \| `undefined` | `'default'`         | Size of the expand/collapse button.                                                                                         |
| `buttonColor`       | `string`                                        | `'medium'`          | Color of the expand/collapse button. Accepts any valid Ionic color.                                                         |
| `iconSize`          | `'small'` \| `'default'` \| `'large'`           | `'default'`         | Size of the icons used in the expand/collapse button.                                                                       |
| `fontSize`          | `string`                                        | `'inherit'`         | Font size of the text labels. Accepts any valid CSS font-size value (e.g., `'16px'`, `'1em'`, `'larger'`).                 |
| `expandedIconName`  | `string`                                        | `'chevron-down'`    | Icon name to display when a node is expanded. Must be a valid Ionicon name.                                                 |
| `collapsedIconName` | `string`                                        | `'chevron-forward'` | Icon name to display when a node is collapsed. Must be a valid Ionicon name.                                                |
| `nodePadding`       | `string`                                        | `'40px'`            | Padding applied to child nodes.                                                                                             |

### Outputs

| Output              | Type                      | Description                                                    |
| ------------------- | ------------------------- | -------------------------------------------------------------- |
| `selectChangeEvent` | `EventEmitter<TodoItem[]>` | Emits the list of selected items whenever the selection changes. |

### TodoItem Model

The `TodoItem` interface represents each node in the tree.

```typescript
export interface TodoItem {
  id: number;
  name: string;
  parentId?: number;
  selected?: boolean;
  expanded?: boolean;
  children?: TodoItem[];
}
```

- `id`: Unique identifier for the node.
- `name`: Display name of the node.
- `parentId`: `id` of the parent node (if any).
- `selected`: Whether the node is selected.
- `expanded`: Whether the node is expanded.
- `children`: Array of child `TodoItem` nodes.

## Styling

The component comes with default styles but allows for extensive customization.

### Overriding Default Styles

You can override styles by using the following methods:

#### 1. Using `@Input()` Properties

Properties like `fontSize`, `iconSize`, and `nodePadding` allow you to adjust styles directly.

Example:

```html
<cdk-tree-select
  [data]="treeData"
  fontSize="14px"
  nodePadding="30px"
></cdk-tree-select>
```

#### 2. Custom CSS Variables

The component uses some CSS variables, which you can override in your global styles or component-specific styles.

Example:

```css
:root {
  --tree-node-padding: 50px;
}
```

#### 3. Deep CSS Selectors

As a last resort, you can use deep selectors to override styles:

```css
cdk-tree-select ::ng-deep .tree-node {
  background-color: #f9f9f9;
}
```

**Note**: Use deep selectors cautiously, as they may affect encapsulation and maintenance.

## Examples

### Basic Usage

```html
<cdk-tree-select
  [data]="treeData"
  (selectChangeEvent)="onSelectChange($event)"
></cdk-tree-select>
```

### Customizing Icons and Font Size

```html
<cdk-tree-select
  [data]="treeData"
  [iconSize]="'large'"
  [fontSize]="'18px'"
  [expandedIconName]="'caret-down-outline'"
  [collapsedIconName]="'caret-forward-outline'"
  (selectChangeEvent)="onSelectChange($event)"
></cdk-tree-select>
```

**Note**: Ensure the custom icons are registered using `addIcons` from `ionicons`.

```typescript
import { addIcons } from 'ionicons';
import { caretDownOutline, caretForwardOutline } from 'ionicons/icons';

addIcons({
  'caret-down-outline': caretDownOutline,
  'caret-forward-outline': caretForwardOutline,
});
```

### Adjusting Node Padding

```html
<cdk-tree-select
  [data]="treeData"
  [nodePadding]="'60px'"
></cdk-tree-select>
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss changes.

### Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/ion-cdk-tree-select.git
cd ion-cdk-tree-select
npm install
```

Run the development server:

```bash
npm start
```

## License

This project is licensed under the MIT License.

---
