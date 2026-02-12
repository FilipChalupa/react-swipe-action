import type { Meta, StoryObj } from '@storybook/react'
import { StrictMode } from 'react'
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
		<StrictMode>
			<div className="wrapper">
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
							<button
								className="content"
								onClick={() => {
									alert('Click left side!')
								}}
							>
								🔖
							</button>
						),
						background: <div className="background_start" />,
						onLongSwipe: () => {
							alert('Long swipe from left side!')
						},
					}}
					endAction={{
						content: (
							<button
								className="content"
								onClick={() => {
									alert('Click right side!')
								}}
							>
								🗑️
							</button>
						),
						background: <div className="background_end" />,
						onLongSwipe: async () => {
							await new Promise((resolve) => setTimeout(resolve, 1000)) // Pretend it is processing something.
							alert(
								'Long swipe from right side which took some time to process!',
							)
						},
					}}
				/>
			</div>
		</StrictMode>
	),
}
