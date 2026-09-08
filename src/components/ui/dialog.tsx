"use client";

import * as React from "react";

import { cn } from "../../lib/cn";

import { IconClose } from "./icons";

interface DialogContextValue {
  descriptionId: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  titleId: string;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(componentName: string) {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error(`${componentName} must be rendered inside Dialog.`);
  }

  return context;
}

export interface DialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export function Dialog({
  children,
  defaultOpen = false,
  onOpenChange,
  open: controlledOpen,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const openRef = React.useRef(open);
  const generatedId = React.useId();

  openRef.current = open;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (openRef.current === nextOpen) {
        return;
      }

      openRef.current = nextOpen;

      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const context = React.useMemo<DialogContextValue>(
    () => ({
      descriptionId: `${generatedId}-description`,
      onOpenChange: setOpen,
      open,
      titleId: `${generatedId}-title`,
    }),
    [generatedId, open, setOpen],
  );

  return <DialogContext.Provider value={context}>{children}</DialogContext.Provider>;
}

export type DialogTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, onClick, type = "button", ...props }, ref) => {
    const { onOpenChange, open } = useDialogContext("DialogTrigger");

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={cn("cursor-pointer", className)}
        aria-expanded={props["aria-expanded"] ?? open}
        aria-haspopup={props["aria-haspopup"] ?? "dialog"}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented) {
            onOpenChange(true);
          }
        }}
      />
    );
  },
);

DialogTrigger.displayName = "DialogTrigger";

export type DialogCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, onClick, type = "button", ...props }, ref) => {
    const { onOpenChange } = useDialogContext("DialogClose");

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={cn("cursor-pointer", className)}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented) {
            onOpenChange(false);
          }
        }}
      />
    );
  },
);

DialogClose.displayName = "DialogClose";

export interface DialogContentProps extends Omit<React.ComponentPropsWithoutRef<"dialog">, "open"> {
  closeLabel?: string;
  showCloseButton?: boolean;
}

export const DialogContent = React.forwardRef<HTMLDialogElement, DialogContentProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      children,
      className,
      closeLabel = "Close dialog",
      onCancel,
      onClick,
      onClose,
      showCloseButton = true,
      ...props
    },
    forwardedRef,
  ) => {
    const { descriptionId, onOpenChange, open, titleId } = useDialogContext("DialogContent");
    const dialogRef = React.useRef<HTMLDialogElement | null>(null);

    const setDialogRef = React.useCallback(
      (node: HTMLDialogElement | null) => {
        dialogRef.current = node;

        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    React.useEffect(() => {
      const dialog = dialogRef.current;

      if (!dialog) {
        return;
      }

      if (open && !dialog.open) {
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close();
      }
    }, [open]);

    return (
      <dialog
        {...props}
        ref={setDialogRef}
        aria-describedby={ariaDescribedBy ?? descriptionId}
        aria-labelledby={ariaLabelledBy ?? titleId}
        className={cn(
          "relative m-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-md border border-white/8 bg-[#121215] p-0 text-zinc-100 outline-none shadow-none backdrop:bg-black/70 backdrop:backdrop-blur-sm",
          className,
        )}
        onCancel={(event) => {
          onCancel?.(event);

          if (!event.defaultPrevented) {
            onOpenChange(false);
          }
        }}
        onClick={(event) => {
          onClick?.(event);

          if (event.defaultPrevented || event.target !== event.currentTarget) {
            return;
          }

          const bounds = event.currentTarget.getBoundingClientRect();
          const isOutside =
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom;

          if (isOutside) {
            onOpenChange(false);
          }
        }}
        onClose={(event) => {
          onClose?.(event);
          onOpenChange(false);
        }}
      >
        {children}
        {showCloseButton ? (
          <DialogClose
            aria-label={closeLabel}
            className="absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-sm border border-transparent text-zinc-500 outline-none transition-colors hover:border-white/8 hover:bg-[#18181b] hover:text-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121215]"
          >
            <IconClose aria-hidden="true" />
          </DialogClose>
        ) : null}
      </dialog>
    );
  },
);

DialogContent.displayName = "DialogContent";

export type DialogTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "id">;

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => {
    const { titleId } = useDialogContext("DialogTitle");

    return (
      <h2
        ref={ref}
        id={titleId}
        className={cn("text-sm font-medium text-zinc-50", className)}
        {...props}
      />
    );
  },
);

DialogTitle.displayName = "DialogTitle";

export type DialogDescriptionProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

export const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => {
    const { descriptionId } = useDialogContext("DialogDescription");

    return (
      <p
        ref={ref}
        id={descriptionId}
        className={cn("mt-1.5 text-xs leading-5 text-zinc-400", className)}
        {...props}
      />
    );
  },
);

DialogDescription.displayName = "DialogDescription";
