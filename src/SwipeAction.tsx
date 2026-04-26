'use client'

import type {
	CSSProperties,
	FunctionComponent,
	ReactNode,
	RefObject,
} from 'react'
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react'
import {
	useDrag,
	type Position,
	type PositionWithVelocity,
} from 'react-use-drag'
import styles from './SwipeAction.module.css'

type OnLongSwipe = () => void | Promise<void>
type Content = ReactNode

export type Action = {
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

const context = createContext({
	reset: (): void => {
		throw new Error("Can't call reset outside SwipeAction component.")
	},
})

export type SwipeActionProps = {
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
	const mainRef = useRef<HTMLDivElement>(null)
	const startActionContentRef = useRef<HTMLDivElement>(null)
	const endActionContentRef = useRef<HTMLDivElement>(null)
	const isLongSwipeEnabled = useRef(true) // Prevents long swipe from being triggered twice in React strict mode
	const onRelativePositionChange = useCallback(
		({ x }: PositionWithVelocity) => {
			if (Math.abs(x) > 5) {
				setIsSwiping(true)
			}
			setPositionOffset(x)
		},
		[],
	)
	const onEnd = useCallback(
		({ x }: PositionWithVelocity) => {
			const newPosition = position + x
			setPosition(newPosition)
			setPositionOffset(0)
			if (x === 0) {
				setIsSwiping(false)
			} else if (newPosition === 0) {
				setTimeout(() => {
					setIsSwiping(false)
				}, 200) // Delay to ignore immediate click
			}
			const mainWidth = mainRef.current?.offsetWidth ?? 0
			if (mainWidth > 0 && Math.abs(newPosition) >= mainWidth - 0.5) {
				const onLongSwipe =
					newPosition > 0 ? startAction?.onLongSwipe : endAction?.onLongSwipe
				if (onLongSwipe && isLongSwipeEnabled.current) {
					isLongSwipeEnabled.current = false
					Promise.resolve(onLongSwipe()).then(() => {
						setPosition(0)
						setIsSwiping(false)
					})
				}
			}
		},
		[position, startAction?.onLongSwipe, endAction?.onLongSwipe],
	)
	const onStart = useCallback(() => {
		isLongSwipeEnabled.current = true
	}, [])
	const snapPoints = useMemo((): Position[] => {
		const mainWidth = mainRef.current?.offsetWidth ?? 0
		const startWidth = startActionContentRef.current?.offsetWidth ?? 0
		const endWidth = endActionContentRef.current?.offsetWidth ?? 0
		const points: Position[] = [{ x: -position, y: 0 }]
		if (startAction) {
			if (startWidth > 0) points.push({ x: startWidth - position, y: 0 })
			if (startAction.onLongSwipe && mainWidth > 0)
				points.push({ x: mainWidth - position, y: 0 })
		}
		if (endAction) {
			if (endWidth > 0) points.push({ x: -endWidth - position, y: 0 })
			if (endAction.onLongSwipe && mainWidth > 0)
				points.push({ x: -mainWidth - position, y: 0 })
		}
		return points
	}, [position, startAction, endAction])
	const { elementProps } = useDrag({
		onStart,
		onRelativePositionChange,
		onEnd,
		inertia: true,
		snapPoints,
	})

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

	const reset = useCallback(() => {
		setPosition(0)
		setPositionOffset(0)
		setIsSwiping(false)
	}, [])

	return (
		<context.Provider value={{ reset }}>
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
		</context.Provider>
	)
}

type ActionPosition = 'start' | 'end'

const Action: FunctionComponent<{
	position: ActionPosition
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

export const useSwipeActionReset = () => useContext(context).reset
