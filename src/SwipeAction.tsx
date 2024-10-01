'use client'

import type {
	CSSProperties,
	FunctionComponent,
	ReactNode,
	RefObject,
} from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useDrag } from 'react-use-drag'
import styles from './SwipeAction.module.css'

// @TODO: add inertia
// @TODO: animate snapping
// @TODO: add threshold - maybe to react-use-drag

type OnLongSwipe = () => void
type Content = ReactNode

type Action = {
	background?: ReactNode
	content?: Content
	onLongSwipe?: OnLongSwipe
} & (
	| {
			content: Content
	  }
	| {
			onLongSwipe: OnLongSwipe
	  }
)

type SwipeActionProps = {
	main: (handle: ReactNode) => ReactNode
	startAction?: Action
	endAction?: Action
}

export const SwipeAction: FunctionComponent<SwipeActionProps> = ({
	startAction,
	endAction,
	main,
}) => {
	const [position, setPosition] = useState(0)
	const [positionOffset, setPositionOffset] = useState(0)
	const [isSwiping, setIsSwiping] = useState(false)
	const onRelativePositionChange = useCallback((x: number) => {
		if (Math.abs(x) > 5) {
			setIsSwiping(true)
		}
		setPositionOffset(x)
	}, [])
	const isLongSwipeEnabled = useRef(true) // Prevents long swipe from being triggered twice in React strict mode
	const onEnd = useCallback(
		(x: number) => {
			if (x === 0) {
				setIsSwiping(false)
			} else {
				setPosition((position) => {
					const newPosition = position + x
					const mainWidth = mainRef.current?.offsetWidth ?? 0

					const handleContent = (
						ref: RefObject<HTMLDivElement>,
						position: Position,
						onLongSwipe: undefined | OnLongSwipe,
					) => {
						const contentWidth = ref.current?.offsetWidth
						const positionSign = position === 'start' ? 1 : -1
						const normalizedSwipePosition = positionSign * newPosition
						if (
							onLongSwipe &&
							contentWidth !== undefined &&
							normalizedSwipePosition >
								Math.max(mainWidth / 4, contentWidth) * 1.6
						) {
							if (isLongSwipeEnabled.current) {
								onLongSwipe()
								isLongSwipeEnabled.current = false
							}
							return positionSign * mainWidth
						}
						if (
							contentWidth !== 0 &&
							contentWidth !== undefined &&
							normalizedSwipePosition > contentWidth * 0.7
						) {
							return positionSign * contentWidth
						}
						if (Math.sign(newPosition) === positionSign) {
							setTimeout(() => {
								setIsSwiping(false)
							}, 200) // Delay to ignore immediate click
							return 0
						}
					}

					return (
						handleContent(
							startActionContentRef,
							'start',
							startAction?.onLongSwipe,
						) ??
						handleContent(endActionContentRef, 'end', endAction?.onLongSwipe) ??
						newPosition
					)
				})
			}
			setPositionOffset(0)
		},
		[startAction?.onLongSwipe, endAction?.onLongSwipe],
	)
	const onStart = useCallback(() => {
		isLongSwipeEnabled.current = true
	}, [])
	const { elementProps } = useDrag({
		onStart,
		onRelativePositionChange,
		onEnd,
	})
	const mainRef = useRef<HTMLDivElement>(null)
	const startActionContentRef = useRef<HTMLDivElement>(null)
	const endActionContentRef = useRef<HTMLDivElement>(null)

	const x = useMemo(
		() =>
			Math.max(
				endAction ? Number.NEGATIVE_INFINITY : 0,
				Math.min(
					startAction ? Number.POSITIVE_INFINITY : 0,
					position + positionOffset,
				),
			),
		[position, positionOffset, startAction, endAction],
	)

	return (
		<div className={styles.wrapper}>
			{startAction && x > 0 && (
				<Action
					position="start"
					content={startAction.content}
					background={startAction.background}
					contentRef={startActionContentRef}
				/>
			)}
			{endAction && x < 0 && (
				<Action
					position="end"
					content={endAction.content}
					background={endAction.background}
					contentRef={endActionContentRef}
				/>
			)}
			<div
				className={styles.main}
				ref={mainRef}
				style={
					{
						'--x': `${x}px`,
					} as CSSProperties
				}
			>
				{main(
					<div
						className={styles.handle}
						{...elementProps}
						onClick={(event) => {
							if (isSwiping) {
								event.stopPropagation()
							}
						}}
					/>,
				)}
			</div>
		</div>
	)
}

type Position = 'start' | 'end'

const Action: FunctionComponent<{
	position: Position
	content: ReactNode
	background: ReactNode
	contentRef: RefObject<HTMLDivElement>
}> = ({ content, background, position, contentRef }) => {
	// @TODO: allow focus by tab key before visible
	return (
		<div className={`${styles.action} ${styles[`is_position_${position}`]}`}>
			<div className={styles.action_background}>{background}</div>
			<div className={styles.action_content} ref={contentRef}>
				{content}
			</div>
		</div>
	)
}
