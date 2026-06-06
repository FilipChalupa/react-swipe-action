# React Swipe Action [![npm](https://img.shields.io/npm/v/react-swipe-action.svg)](https://www.npmjs.com/package/react-swipe-action) ![npm type definitions](https://img.shields.io/npm/types/react-swipe-action.svg)

Swipe to reveal or perform an action. Try the interactive [Storybook demo](https://filipchalupa.cz/react-swipe-action/).

## Features

- Works with both mouse and touch events.
- Supports actions on both the left (start) and right (end) sides.
- "Long swipe" gesture to trigger an action.
- Customizable content and backgrounds for each side.
- `useSwipeActionReset` hook to programmatically close the swipe action.
- Written in TypeScript.

## Installation

```bash
npm install react-swipe-action
```

## How to use

Import the component and the CSS file.

```jsx
import { SwipeAction } from 'react-swipe-action'
import 'react-swipe-action/dist/index.css'
```

Use the `SwipeAction` component. The `main` prop is a function that receives a `handle` which you should pass to the element you want to be draggable.

```jsx
<SwipeAction
  main={(handle) => (
    <div className="main-content">
      Swipe me
      {handle}
    </div>
  )}
  inertia
  startAction={...}
  endAction={...}
/>
```

### Actions

You can define `startAction` (swipe from left to right) and/or `endAction` (swipe from right to left).

An action is an object with the following properties:

- `content`: The content to be revealed (e.g., a button).
- `background`: The background that is shown behind the content.
- `onLongSwipe`: A function to be called when a "long swipe" is performed.

### Inertia

Pass the `inertia` prop to enable momentum-based snapping — the element will spring-animate to the nearest snap point after release.

```jsx
<SwipeAction inertia .../>
```

### Nesting in scrollable parents

`SwipeAction` claims only horizontally dominant gestures. A vertically dominant drag is left for parent elements, so you can nest a `SwipeAction` inside a vertical scroller or a bottom sheet (such as one built on [`react-use-drag`](https://www.npmjs.com/package/react-use-drag)) and both gestures keep working — horizontal swipes reveal the action while vertical drags scroll or move the parent. This works out of the box thanks to `react-use-drag`'s nested gesture coordination: when the inner swipe doesn't claim a gesture, it bubbles up to the outer element.

Action and its properties are optional, so you can choose to only implement one side or just the long swipe.

```jsx
<SwipeAction
	main={(handle) => <button>Main content{handle}</button>}
	endAction={{
		content: <button onClick={() => alert('Action clicked!')}>Delete</button>,
		background: <div style={{ backgroundColor: 'red' }} />,
		onLongSwipe: () => alert('Long swipe!'),
	}}
/>
```

### Closing the action programmatically

You can use the `useSwipeActionReset` hook to get a function that will reset the swipe action to its initial state. This is useful when you want to close the action after a button is clicked.

```jsx
import { SwipeAction, useSwipeActionReset } from 'react-swipe-action'

const ActionButton = ({ onClick, children }) => {
	const reset = useSwipeActionReset()
	return (
		<button
			onClick={async () => {
				await onClick()
				reset()
			}}
		>
			{children}
		</button>
	)
}

// ...

;<SwipeAction
	// ...
	endAction={{
		content: (
			<ActionButton onClick={() => alert('Deleted!')}>Delete</ActionButton>
		),
		// ...
	}}
/>
```

## API

### `<SwipeAction />` Props

| Prop          | Type                               | Description                                                                                                                       |
| ------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `main`        | `(handle: ReactNode) => ReactNode` | **Required.** A function that returns the main content. It receives a `handle` which should be rendered on the draggable element. |
| `inertia`     | `boolean`                          | Enables momentum-based snapping — the element spring-animates to the nearest snap point after release.                            |
| `startAction` | `Action`                           | An action to be performed when swiping from left to right.                                                                        |
| `endAction`   | `Action`                           | An action to be performed when swiping from right to left.                                                                        |

### `Action` Type

| Prop          | Type         | Description                                                                                                                        |
| ------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `content`     | `ReactNode`  | The content to be revealed when swiping.                                                                                           |
| `background`  | `ReactNode`  | The background to be shown behind the content.                                                                                     |
| `onLongSwipe` | `() => void` | A callback function that is triggered on a "long swipe" gesture. This can be used for quick actions without revealing the content. |

### `useSwipeActionReset()`

A custom hook that returns a `reset` function. Call `reset()` to programmatically close the swipe action.

## Example

```jsx
import { SwipeAction, useSwipeActionReset } from 'react-swipe-action'
import 'react-swipe-action/dist/index.css'

const pretendWork = () => new Promise((resolve) => setTimeout(resolve, 1000))

const ActionButton = ({ onClick, children }) => {
	const reset = useSwipeActionReset()
	return (
		<button
			onClick={async () => {
				await onClick()
				reset()
			}}
		>
			{children}
		</button>
	)
}

const App = () => {
	return (
		<SwipeAction
			main={(handle) => (
				<button
					className="main"
					onClick={() => {
						alert("You've clicked me!")
					}}
				>
					Swipe me
					{handle}
				</button>
			)}
			startAction={{
				content: (
					<ActionButton
						onClick={() => {
							alert('Click left side!')
						}}
					>
						🔖
					</ActionButton>
				),
				background: <div style={{ backgroundColor: 'blue' }} />,
				onLongSwipe: () => {
					alert('Long swipe from left side!')
				},
			}}
			endAction={{
				content: (
					<ActionButton
						onClick={async () => {
							await pretendWork()
							alert('Click right side which took some time to process!')
						}}
					>
						🗑️
					</ActionButton>
				),
				background: <div style={{ backgroundColor: 'red' }} />,
				onLongSwipe: async () => {
					await pretendWork()
					alert('Long swipe from right side which took some time to process!')
				},
			}}
		/>
	)
}
```
