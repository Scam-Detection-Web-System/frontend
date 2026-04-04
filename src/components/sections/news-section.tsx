"use client"

import { Newspaper, Clock, ArrowRight, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { newsArticles } from "@/pages/user/NewsDetailPage"

export function NewsSection() {
  const navigate = useNavigate()

  return (
    <section id="tin-tuc" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
            <Newspaper className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tin tức & Cảnh báo mới nhất
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Cập nhật thông tin về các chiêu trò lừa đảo mới để bạn luôn cảnh giác và bảo vệ mình.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsArticles.map((article) => (
            <Card
              key={article.id}
              className="group cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/5"
              onClick={() => navigate(`/tintuc/${article.id}`)}
            >
              
              {article.imageUrl && (
                <div className="w-full h-48 overflow-hidden rounded-t-lg">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={article.isUrgent ? "destructive" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {article.isUrgent && <AlertTriangle className="h-3 w-3" />}
                    {article.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {article.date}
                  </div>
                </div>
                <CardTitle className="line-clamp-2 text-xl font-extrabold leading-snug transition-colors group-hover:text-primary">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 text-foreground/80 font-medium text-[15px] mt-2">
                  {article.excerpt}
                </CardDescription>
                <div className="mt-4 flex items-center text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                  Đọc thêm
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" onClick={() => navigate("/tintuc")}>
            Xem tất cả tin tức
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
