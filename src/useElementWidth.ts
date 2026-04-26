import { type RefObject, useEffect, useState } from 'react'

export const useElementWidth = (ref: RefObject<HTMLElement | null>): number => {
	const [width, setWidth] = useState(0)

	useEffect(() => {
		const element = ref.current
		if (!element) {
			return
		}

		const observer = new ResizeObserver(([entry]) => {
			setWidth(
				entry.borderBoxSize?.at(0)?.inlineSize ?? entry.contentRect.width,
			)
		})
		observer.observe(element)
		return () => {
			observer.disconnect()
		}
	}, [ref])

	return width
}
