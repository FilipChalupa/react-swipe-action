import { type RefCallback, useCallback, useRef, useState } from 'react'

export const useElementWidth = (): [
	RefCallback<HTMLElement | null>,
	number,
] => {
	const [width, setWidth] = useState(0)
	const observerRef = useRef<ResizeObserver | null>(null)

	const ref = useCallback((element: HTMLElement | null) => {
		observerRef.current?.disconnect()
		observerRef.current = null
		if (!element) {
			return
		}
		observerRef.current = new ResizeObserver(([entry]) => {
			setWidth(
				entry.borderBoxSize?.at(0)?.inlineSize ?? entry.contentRect.width,
			)
		})
		observerRef.current.observe(element)
	}, [])

	return [ref, width]
}
