import type { Meta, StoryObj } from '@storybook/react'
import { SwipeAction } from './SwipeAction'
import './SwipeAction.stories.css'

const meta = {
	title: 'Swipe action',
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
} satisfies Meta<typeof SwipeAction>

export default meta
type Story = StoryObj<typeof meta>

export const All: Story = {
	render: () => (
		<div className='wrapper'>
			<SwipeAction
				main={(handle) => (
					<button className="main" onClick={() => {
						alert('You\'ve clicked me!')
					}}>
						Swipe me
						{handle}
					</button>
				)}
				startAction={{
					onLongSwipe: () => {
						alert('Long swipe from left side!')
					}
				}}
				endAction={{
					onLongSwipe: () => {
						alert('Long swipe from right side!')
					}
				}}
			/></div>
	),
}
