"use client"

import React from "react"

import { useState } from "react"
import { AlertTriangle, Send, CheckCircle, Loader2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LoginDialog } from "@/components/shared/login-dialog"
import { useAuth } from "@/contexts/auth-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ReportForm() {
  const { user, isAuthenticated } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    scamPhone: "",
    scamType: "",
    description: "",
    contactEmail: user?.email || "",
  })

  const scamTypes = [
    { value: "phishing", label: "Phishing - Giả mạo website" },
    { value: "investment", label: "Lừa đảo đầu tư" },
    { value: "shopping", label: "Lừa đảo mua sắm online" },
    { value: "romance", label: "Lừa đảo tình cảm" },
    { value: "job", label: "Lừa đảo tuyển dụng" },
    { value: "lottery", label: "Lừa đảo trúng thưởng" },
    { value: "other", label: "Loại khác" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <section id="bao-cao" className="bg-secondary py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-2xl">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="mb-4 rounded-full bg-success/10 p-4">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Cảm ơn bạn đã báo cáo!
              </h3>
              <p className="mt-2 text-muted-foreground">
                Báo cáo của bạn đã được gửi thành công. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất.
              </p>
              <Button
                className="mt-6"
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({
                    scamPhone: "",
                    scamType: "",
                    description: "",
                    contactEmail: "",
                  })
                }}
              >
                Gửi báo cáo khác
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="bao-cao" className="bg-secondary py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Báo cáo Lừa đảo
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Giúp cộng đồng bằng cách báo cáo các trang web và hành vi lừa đảo mà bạn gặp phải.
          </p>
        </div>

        {!isAuthenticated ? (
          <Card className="mx-auto mt-10 max-w-2xl">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <LogIn className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Yêu cầu đăng nhập
              </h3>
              <p className="mt-2 max-w-md text-muted-foreground">
                Bạn cần đăng nhập để gửi báo cáo lừa đảo. Điều này giúp chúng tôi xác minh và xử lý báo cáo tốt hơn.
              </p>
              <Button
                className="mt-6"
                onClick={() => setShowLoginDialog(true)}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Đăng nhập ngay
              </Button>
            </CardContent>
          </Card>
        ) : (

          <Card className="mx-auto mt-10 max-w-2xl">
            <CardHeader>
              <CardTitle>Gửi báo cáo lừa đảo</CardTitle>
              <CardDescription>
                Điền đầy đủ thông tin để chúng tôi có thể xử lý báo cáo nhanh chóng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="scamPhone">Số điện thoại lừa đảo *</Label>
                  <Input
                    id="scamPhone"
                    type="tel"
                    placeholder="0912 345 678"
                    required
                    value={formData.scamPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, scamPhone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scamType">Loại lừa đảo *</Label>
                  <Select
                    required
                    value={formData.scamType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, scamType: value })
                    }
                  >
                    <SelectTrigger id="scamType">
                      <SelectValue placeholder="Chọn loại lừa đảo" />
                    </SelectTrigger>
                    <SelectContent>
                      {scamTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả chi tiết *</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết về vụ lừa đảo bạn gặp phải..."
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email liên hệ (không bắt buộc)</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Để lại email nếu bạn muốn nhận phản hồi về báo cáo
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Gửi báo cáo
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      </div>
    </section>
  )
}
