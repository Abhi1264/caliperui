import * as React from "react";

export type IconProps = Omit<React.SVGProps<SVGSVGElement>, "children"> & {
  title?: string;
};

type IconBaseProps = IconProps & {
  children: React.ReactNode;
};

const IconBase = React.forwardRef<SVGSVGElement, IconBaseProps>(
  (
    {
      title,
      children,
      width = 16,
      height = 16,
      fill = "none",
      stroke = "currentColor",
      strokeWidth = 1.5,
      strokeLinecap = "round",
      strokeLinejoin = "round",
      role,
      focusable = "false",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-hidden": ariaHidden,
      ...props
    },
    ref,
  ) => {
    const titleId = React.useId();
    const hasAccessibleName = Boolean(title || ariaLabel || ariaLabelledBy);

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox="0 0 16 16"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        role={role ?? (hasAccessibleName ? "img" : undefined)}
        focusable={focusable}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? (title ? titleId : undefined)}
        aria-hidden={ariaHidden ?? (hasAccessibleName ? undefined : true)}
        {...props}
      >
        {title ? <title id={titleId}>{title}</title> : null}
        {children}
      </svg>
    );
  },
);

IconBase.displayName = "IconBase";

export const IconClose = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="m4 4 8 8M12 4l-8 8" />
  </IconBase>
));

IconClose.displayName = "IconClose";

export const IconCheck = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="m3.5 8.25 3 3 6-6.5" />
  </IconBase>
));

IconCheck.displayName = "IconCheck";

export const IconCopy = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <rect x="5.25" y="5.25" width="7.5" height="7.5" rx="1" />
    <path d="M10.75 5.25v-1a1 1 0 0 0-1-1h-5.5a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1h1" />
  </IconBase>
));

IconCopy.displayName = "IconCopy";

export const IconCommand = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M12 6a2 2 0 1 0-2-2v8a2 2 0 1 0 2-2H4a2 2 0 1 0 2 2V4a2 2 0 1 0-2 2Z" />
  </IconBase>
));

IconCommand.displayName = "IconCommand";

export const IconSearch = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <circle cx="7" cy="7" r="3.75" />
    <path d="m10 10 3 3" />
  </IconBase>
));

IconSearch.displayName = "IconSearch";
