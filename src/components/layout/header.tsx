"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Shield, Menu, X, LogOut, LayoutDashboard, User as UserIcon, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { LoginDialog } from "@/components/shared/login-dialog"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const { user, logout, isAuthenticated, isAdmin } = useAuth()

  const navLinks = [
    { href: "/baocao", label: "Báo cáo Lừa đảo" },
    { href: "/tintuc", label: "Tin tức" },
    { href: "/huongdan", label: "Hướng dẫn" },
  ]

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.205_0_0)] dark:bg-white/10">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">AnTiScaQ</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex md:items-center md:gap-4">
          <ModeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 pl-1.5">
                  <Avatar className="h-7 w-7">
                    {user?.avatar ? (
                      <AvatarImage src={user.avatar} alt={user?.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                {/* User info header */}
                <DropdownMenuLabel className="flex items-center gap-3 py-3">
                  <Avatar className="h-10 w-10">
                    {user?.avatar ? (
                      <AvatarImage src={user.avatar} alt={user?.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Trang cá nhân — navigates to /taikhoan */}
                <DropdownMenuItem asChild className="gap-2 py-2.5">
                  <Link to="/taikhoan">
                    <UserIcon className="h-4 w-4" />
                    Trang cá nhân
                  </Link>
                </DropdownMenuItem>

                {/* Bảo mật — navigates to /baomat */}
                <DropdownMenuItem asChild className="gap-2 py-2.5">
                  <Link to="/baomat">
                    <ShieldCheck className="h-4 w-4" />
                    Bảo mật
                  </Link>
                </DropdownMenuItem>

                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="gap-2 py-2.5">
                      <Link to="/admin">
                        <LayoutDashboard className="h-4 w-4" />
                        Quản trị
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive gap-2 py-2.5">
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setShowLoginDialog(true)}>Đăng nhập</Button>
          )}
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-slate-900 dark:text-white" />
          ) : (
            <Menu className="h-6 w-6 text-slate-900 dark:text-white" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 md:hidden dark:border-slate-800">
          <nav className="flex flex-col space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <ModeToggle />
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2 dark:border-slate-800">
                    <Avatar className="h-8 w-8">
                      {user?.avatar ? (
                        <AvatarImage src={user.avatar} alt={user?.name} />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" asChild className="w-full gap-2" onClick={() => setIsMenuOpen(false)}>
                    <Link to="/taikhoan">
                      <UserIcon className="h-4 w-4" />
                      Trang cá nhân
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full gap-2" onClick={() => setIsMenuOpen(false)}>
                    <Link to="/baomat">
                      <ShieldCheck className="h-4 w-4" />
                      Bảo mật
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="outline" asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Link to="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Quản trị
                      </Link>
                    </Button>
                  )}
                  <Button variant="destructive" onClick={logout} className="w-full gap-2">
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <Button onClick={() => setShowLoginDialog(true)} className="w-full">
                  Đăng nhập
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </header>
  )
}
