# React swipe action [![npm](https://img.shields.io/npm/v/react-swipe-action.svg)](https://www.npmjs.com/package/react-swipe-action) ![npm type definitions](https://img.shields.io/npm/types/react-swipe-action.svg)

## Installation

```bash
npm install react-swipe-action
```

## How to use

```jsx
import { SwipeAction } from 'react-swipe-action'
import 'react-swipe-action/dist/index.css'

const App = () => {
	return (
		<SwipeAction
			main={(handle) => <button onClick={() => { alert('Click') }} style={{ position: 'relative' }}>
				Button
				{handle}
			</button>}
			endAction={{
				content: (
					<button
						type="button"
						onClick={() => { alert('Right action') }}
					>
						Right action
					</button>
				),
				onLongSwipe: () => { alert('Right action') },
				background: <div style={{ backgroundColor: 'red' }} />,
			}}
		/>
	)
}
```
