"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getCurrentUser, getProfile } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { Flame, Heart, MessageCircle, Plus, Share2, TrendingUp, Users } from "lucide-react"

type Post = {
  id: string
  user_id?: string
  name: string
  avatar: string
  handle: string
  content: string
  image?: string
  likes: number
  comments: number
  tags: string[]
}

export default function FitGramPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [draft, setDraft] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [currentUserId, setCurrentUserId] = useState("")
  const [currentUserName, setCurrentUserName] = useState("You")
  const [currentUserAvatar] = useState("/placeholder-user.jpg")
  const [currentUserHandle, setCurrentUserHandle] = useState("@you")

  const stories = useMemo(
    () => [
      { name: "You", avatar: "/placeholder-user.jpg" },
      { name: "Ananya", avatar: "/diverse-woman-smiling.png" },
      { name: "Shreya", avatar: "/woman-profile.png" },
      { name: "Rohit", avatar: "/man-profile.png" },
      { name: "FitLab", avatar: "/carousel1.jpg" },
    ],
    [],
  )

  const loadPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from("fitgram_posts")
      .select("id,user_id,author_name,author_avatar,author_handle,content,image,tags,likes_count,comments_count")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error loading FitGram posts:", error)
      return
    }

    const mappedPosts: Post[] = (data ?? []).map((post) => ({
      id: post.id,
      user_id: post.user_id,
      name: post.author_name,
      avatar: post.author_avatar || "/placeholder-user.jpg",
      handle: post.author_handle,
      content: post.content,
      image: post.image || undefined,
      likes: post.likes_count ?? 0,
      comments: post.comments_count ?? 0,
      tags: post.tags ?? [],
    }))
    setPosts(mappedPosts)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          setIsLoading(false)
          router.push("/auth/login")
          return
        }

        const profile = await getProfile(user.id)
        const fallbackName =
          (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()) ||
          (typeof user.email === "string" && user.email.split("@")[0]) ||
          "You"
        const name = profile?.full_name?.trim() || fallbackName
        const emailHandle = user.email ? `@${user.email.split("@")[0].toLowerCase()}` : "@you"
        const profileHandle = profile?.full_name?.trim()
          ? `@${profile.full_name.trim().toLowerCase().replace(/\s+/g, "_")}`
          : emailHandle

        setCurrentUserId(user.id)
        setCurrentUserName(name)
        setCurrentUserHandle(profileHandle)
        setIsAuthenticated(true)
        await loadPosts()
      } catch (error) {
        console.error("Error checking FitGram auth:", error)
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, loadPosts])

  const createPost = async () => {
    const trimmedDraft = draft.trim()
    if (!isAuthenticated || !trimmedDraft || !currentUserId || isPublishing) return

    setIsPublishing(true)
    try {
      const { data, error } = await supabase
        .from("fitgram_posts")
        .insert({
          user_id: currentUserId,
          author_name: currentUserName,
          author_avatar: currentUserAvatar,
          author_handle: currentUserHandle,
          content: trimmedDraft,
          tags: ["My Journey"],
        })
        .select("id,user_id,author_name,author_avatar,author_handle,content,image,tags,likes_count,comments_count")
        .single()

      if (error) {
        console.error("Error publishing FitGram post:", error)
        alert("Could not publish post right now. Please try again.")
        return
      }

      const newPost: Post = {
        id: data.id,
        user_id: data.user_id,
        name: data.author_name,
        avatar: data.author_avatar || "/placeholder-user.jpg",
        handle: data.author_handle,
        content: data.content,
        image: data.image || undefined,
        likes: data.likes_count ?? 0,
        comments: data.comments_count ?? 0,
        tags: data.tags ?? ["My Journey"],
      }
      setPosts((prev) => [newPost, ...prev])
      setDraft("")
    } catch (error) {
      console.error("Unexpected error publishing FitGram post:", error)
      alert("Could not publish post right now. Please try again.")
    } finally {
      setIsPublishing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading FitGram...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.34fr]">
        <div className="space-y-6">
          <Card className="glass-panel">
            <CardContent className="p-5">
              <p className="text-2xl font-semibold text-slate-900">FitGram Community</p>
              <p className="mt-1 text-slate-600">Share progress, routines, and recovery stories with the community.</p>

              <div className="mt-4 flex gap-4 overflow-x-auto pb-1">
                {stories.map((story) => (
                  <div key={story.name} className="min-w-16 text-center">
                    <div className="mx-auto mb-1 rounded-full bg-gradient-to-br from-cyan-500 to-teal-400 p-[2px]">
                      <Avatar className="h-14 w-14 border-2 border-white">
                        <AvatarImage src={story.avatar} />
                        <AvatarFallback>{story.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="truncate text-xs text-slate-600">{story.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-slate-900">Create Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Share your health update..."
                className="min-h-24 bg-white/80"
              />
              <Button
                onClick={createPost}
                disabled={!draft.trim() || isPublishing}
                className="bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
              >
                <Plus className="mr-2 h-4 w-4" />
                {isPublishing ? "Publishing..." : "Publish"}
              </Button>
            </CardContent>
          </Card>

          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="glass-panel overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback>{post.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-900">{post.name}</p>
                        <p className="text-xs text-slate-500">{post.handle}</p>
                      </div>
                    </div>
                    <Badge variant="outline">Health Post</Badge>
                  </div>

                  {post.image ? (
                    <div className="relative h-72">
                      <Image src={post.image} alt={post.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 70vw" />
                    </div>
                  ) : null}

                  <div className="space-y-3 p-4">
                    <p className="text-slate-700">{post.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-5 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1"><Heart className="h-4 w-4" />{post.likes}</span>
                      <span className="inline-flex items-center gap-1"><MessageCircle className="h-4 w-4" />{post.comments}</span>
                      <span className="inline-flex items-center gap-1"><Share2 className="h-4 w-4" />Share</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <aside className="space-y-4">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <TrendingUp className="h-5 w-5 text-cyan-700" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <p>#MorningMobility</p>
              <p>#BetterSleep</p>
              <p>#AntiInflammatoryMeals</p>
              <p>#30DayRecovery</p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Users className="h-5 w-5 text-cyan-700" />
                Community Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <p className="inline-flex items-center gap-2"><Flame className="h-4 w-4 text-orange-500" />7,200 active members this week</p>
              <p>Most discussed: Sleep and symptom tracking</p>
              <p>Top insight: Consistency beats intensity</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
