import type { Meta, StoryObj } from '@storybook/react'
import {
	StrictMode,
	type FunctionComponent,
	type PropsWithChildren,
} from 'react'
import { SwipeAction, useSwipeActionReset } from './SwipeAction'
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

const pretendWork = () =>
	new Promise<void>((resolve) => setTimeout(resolve, 1000)) // Pretend it is processing something.

const ContentButton: FunctionComponent<
	PropsWithChildren<{ onClick: () => void | Promise<void> }>
> = ({ children, onClick }) => {
	const reset = useSwipeActionReset()
	return (
		<button
			className="content"
			onClick={async () => {
				await onClick()
				reset()
			}}
		>
			{children}
		</button>
	)
}

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
							<ContentButton
								onClick={() => {
									alert('Click left side!')
								}}
							>
								🔖
							</ContentButton>
						),
						background: <div className="background_start" />,
						onLongSwipe: () => {
							alert('Long swipe from left side!')
						},
					}}
					endAction={{
						content: (
							<ContentButton
								onClick={async () => {
									await pretendWork()
									alert('Click right side which took some time to process!')
								}}
							>
								🗑️
							</ContentButton>
						),
						background: <div className="background_end" />,
						onLongSwipe: async () => {
							await pretendWork()
							alert(
								'Long swipe from right side which took some time to process!',
							)
						},
					}}
				/>
				<SwipeAction
					main={(handle) => (
						<button
							className="main"
							onClick={() => {
								alert("You've clicked me!")
							}}
						>
							Swipe me to left
							{handle}
						</button>
					)}
					endAction={{
						content: (
							<ContentButton
								onClick={async () => {
									await pretendWork()
									alert('Click right side which took some time to process!')
								}}
							>
								🗑️
							</ContentButton>
						),
						background: <div className="background_end" />,
					}}
				/>
				<SwipeAction
					main={(handle) => (
						<button
							className="main"
							onClick={() => {
								alert("You've clicked me!")
							}}
						>
							Swipe me to right
							{handle}
						</button>
					)}
					startAction={{
						content: (
							<ContentButton
								onClick={() => {
									alert('Click left side!')
								}}
							>
								🔖
							</ContentButton>
						),
						background: <div className="background_start" />,
					}}
				/>
			</div>
		</StrictMode>
	),
}
