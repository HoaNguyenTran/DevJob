/* eslint-disable react/require-default-props */
import React, { FC, MouseEvent, AnchorHTMLAttributes } from 'react'
import Link, { LinkProps as NextLinkProps } from 'next/link'
import { isExternalLink } from 'src/utils/patterns'

export interface Props
  extends NextLinkProps,
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'target'> {
  openInNewTab?: boolean
  title?: string
  onClick?: (e: MouseEvent) => void
  className?: string
}

const LinkTo: FC<Props> = ({
  href,
  title,
  target,
  onClick,
  className,
  children,
  ...restProps
}) => {
  const openInNewTab = target === '_blank'
  const isExternal = isExternalLink(href)
  const rel = openInNewTab ? 'noreferrer noopener' : undefined

  const handleClick = (e: MouseEvent) => {
    if (onClick) {
      onClick(e)
    }
  }

  if (isExternal || openInNewTab) {
    return (
      <a
        className={className}
        href={href as string}
        title={title}
        target={target}
        rel={rel}
        onClick={handleClick}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} {...restProps} >
      <div className={className}>
      <a onClick={handleClick}>{children}</a>
      </div>
    </Link>
  )
}

export default LinkTo
