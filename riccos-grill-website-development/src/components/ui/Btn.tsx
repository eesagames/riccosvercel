"use client";

import {
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";
import { useSmooth } from "@/components/SmoothScroll";

type Common = {
  variant?: "gold" | "ghost" | "dark";
  magnetic?: boolean;
  children: ReactNode;
  className?: string;
};
type AnchorProps = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
    href: string;
  };
type ButtonProps = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined;
  };

/**
 * Button / link with magnetic pull (fine pointers only), pointer-origin ripple,
 * press feedback and smooth anchor scrolling through the shared Lenis clock.
 */
export function Btn(props: AnchorProps | ButtonProps) {
  const { variant = "gold", magnetic = true, className = "", children } = props;
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const { scrollTo } = useSmooth();

  useEffect(() => {
    const el = ref.current;
    if (!el || !magnetic) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.22);
      y((e.clientY - (r.top + r.height / 2)) * 0.32);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(el);
    };
  }, [magnetic]);

  const ripple = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const s = document.createElement("span");
    s.className = "ripple";
    s.style.width = s.style.height = `${size}px`;
    s.style.left = `${e.clientX - r.left - size / 2}px`;
    s.style.top = `${e.clientY - r.top - size / 2}px`;
    el.appendChild(s);
    setTimeout(() => s.remove(), 700);
  };

  const cls = `btn btn-${variant} ${className}`;

  if (props.href !== undefined) {
    const { href, onClick, variant: _v, magnetic: _m, className: _c, children: _ch, ...rest } = props;
    void _v; void _m; void _c; void _ch;
    return (
      <a
        ref={ref}
        href={href}
        className={cls}
        {...rest}
        onClick={(e) => {
          ripple(e);
          onClick?.(e);
          if (!e.defaultPrevented && href.startsWith("#") && href.length > 1) {
            e.preventDefault();
            scrollTo(href);
            history.replaceState(null, "", href);
          }
        }}
      >
        {children}
      </a>
    );
  }
  const { onClick, variant: _v, magnetic: _m, className: _c, children: _ch, ...rest } = props as ButtonProps;
  void _v; void _m; void _c; void _ch;
  return (
    <button
      ref={ref}
      type="button"
      className={cls}
      {...rest}
      onClick={(e) => {
        ripple(e);
        onClick?.(e);
      }}
    >
      {children}
    </button>
  );
}
