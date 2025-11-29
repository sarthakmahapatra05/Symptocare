"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Badge } from "@/components/ui/badge"

import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Home,
  User,
  Heart,
  MessageCircle,
  Share2,
  Menu,
  X,
  Plus,
  ImageIcon,
  Video,
  Smile,
  TrendingUp,
  Users,
  Award,
  Target,
  Activity,
  Search,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"

export default function FitGramPage() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [postText, setPostText] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedStory, setSelectedStory] = useState<number | null>(null)
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false)
  const [selectedPostImage, setSelectedPostImage] = useState<string | null>(null)
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isSelfProfileModalOpen, setIsSelfProfileModalOpen] = useState(false)
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock data for stories (Instagram-style)
  const stories = [
    {
      id: 1,
      user: {
        name: "Your Story",
        username: "your_story",
        avatar: "/placeholder-user.jpg",
        initials: "YS",
        bio: "Welcome to my wellness journey",
        followers: 0,
        following: 0,
        isVerified: false
      },
      hasStory: false
    },
    {
      id: 2,
      user: {
        name: "Sarah Mitchell",
        username: "sarah_fitness",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        initials: "SM",
        bio: "Certified personal trainer | Yoga instructor | Helping people live healthier lives",
        followers: 12450,
        following: 892,
        isVerified: true
      },
      hasStory: true
    },
    {
      id: 3,
      user: {
        name: "Mike Rodriguez",
        username: "mike_runs",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        initials: "MR",
        bio: "Marathon runner | Nutrition coach | Believe in the power of consistency",
        followers: 8760,
        following: 654,
        isVerified: false
      },
      hasStory: true
    },
    {
      id: 4,
      user: {
        name: "Emma Larsson",
        username: "emma_mindful",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        initials: "EL",
        bio: "Mindfulness coach | Meditation guide | Finding peace in the present moment",
        followers: 15230,
        following: 1201,
        isVerified: true
      },
      hasStory: true
    },
    {
      id: 5,
      user: {
        name: "Dr. Wellness",
        username: "dr_wellness",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        initials: "DW",
        bio: "Board-certified physician | Holistic health advocate | Evidence-based wellness",
        followers: 45670,
        following: 234,
        isVerified: true
      },
      hasStory: true
    },
    {
      id: 6,
      user: {
        name: "FitLife Community",
        username: "fitlife_community",
        avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center",
        initials: "FC",
        bio: "Building a supportive community for health and wellness | #FitFam",
        followers: 89200,
        following: 145,
        isVerified: true
      },
      hasStory: true
    },
  ]

  // Mock data for social posts with enhanced content
  const posts = [
    {
      id: 1,
      user: stories[1].user, // Sarah Mitchell
      content:
        "Just completed my morning workout! 💪 Feeling energized and ready for the day. My joint pain has been much better since starting the new routine.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      likes: 1247,
      comments: 89,
      shares: 34,
      timeAgo: "2h ago",
      tags: ["Fitness", "Joint Health", "Morning Routine"],
      height: "400px",
    },
    {
      id: 2,
      user: stories[2].user, // Mike Rodriguez
      content:
        "Tracking my sleep patterns this week 📊 Notice I feel much better when I get 7+ hours. Anyone else seeing similar patterns?",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=400&fit=crop",
      likes: 892,
      comments: 67,
      shares: 23,
      timeAgo: "4h ago",
      tags: ["Sleep", "Health Tracking", "Wellness"],
      height: "300px",
    },
    {
      id: 3,
      user: stories[3].user, // Emma Larsson
      content:
        "Meal prep Sunday! 🥗 Focusing on anti-inflammatory foods this week to help with my symptoms. Lots of colorful veggies and omega-3 rich foods.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop",
      likes: 1534,
      comments: 112,
      shares: 45,
      timeAgo: "6h ago",
      tags: ["Nutrition", "Meal Prep", "Anti-inflammatory"],
      height: "350px",
    },
    {
      id: 4,
      user: stories[4].user, // Dr. Wellness
      content:
        "Quick tip: Stay hydrated! 💧 Water is essential for joint health and overall wellness. Aim for 8 glasses a day!",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
      likes: 2876,
      comments: 156,
      shares: 89,
      timeAgo: "8h ago",
      tags: ["Hydration", "Joint Health", "Wellness"],
      height: "280px",
    },
    {
      id: 5,
      user: stories[5].user, // FitLife Community
      content:
        "Community challenge: Share your favorite healthy breakfast recipe! 🥣 Let's inspire each other to start the day right.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop",
      likes: 3456,
      comments: 234,
      shares: 123,
      timeAgo: "12h ago",
      tags: ["Breakfast", "Recipes", "Community"],
      height: "420px",
    },
    {
      id: 6,
      user: {
        name: "Alex Chen",
        username: "alex_mindful",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        initials: "AC",
        bio: "Yoga instructor | Meditation practitioner | Finding balance in chaos",
        followers: 9876,
        following: 543,
        isVerified: false
      },
      content:
        "Morning yoga session complete! 🧘‍♀️ The combination of gentle stretches and deep breathing has really helped with my flexibility and stress levels.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
      likes: 1456,
      comments: 78,
      shares: 34,
      timeAgo: "1d ago",
      tags: ["Yoga", "Mental Health", "Flexibility"],
      height: "320px",
    },
  ]

  const trendingTopics = [
    { name: "Morning Routines", posts: 234 },
    { name: "Sleep Tracking", posts: 189 },
    { name: "Healthy Recipes", posts: 156 },
    { name: "Mental Health", posts: 143 },
    { name: "Fitness Goals", posts: 128 },
  ]

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleStoryClick = (storyId: number) => {
    setSelectedStory(storyId)
    setIsStoryViewerOpen(true)
  }

  const handleCloseStoryViewer = () => {
    setIsStoryViewerOpen(false)
    setSelectedStory(null)
  }

  const handlePostImageClick = (imageSrc: string) => {
    setSelectedPostImage(imageSrc)
    setIsImageViewerOpen(true)
  }

  const handleCloseImageViewer = () => {
    setIsImageViewerOpen(false)
    setSelectedPostImage(null)
  }

  const handleProfileClick = (user: any) => {
    setSelectedProfile(user)
    setIsProfileModalOpen(true)
  }

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false)
    setSelectedProfile(null)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setSearchResults([])
      return
    }

    const lowerQuery = query.toLowerCase()

    // Search users
    const userResults = stories
      .filter(story => story.user.name.toLowerCase().includes(lowerQuery) || story.user.username.toLowerCase().includes(lowerQuery))
      .map(story => ({ type: 'user', ...story.user }))

    // Search posts
    const postResults = posts
      .filter(post =>
        post.content.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        post.user.name.toLowerCase().includes(lowerQuery)
      )
      .map(post => ({ type: 'post', ...post }))

    setSearchResults([...userResults, ...postResults])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
      {/* Enhanced Top Navigation */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border fade-in">
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="text-foreground hover:bg-accent smooth-transition p-2"
            >
              {isNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="flex items-center gap-1 sm:gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-primary professional-heading">FitGram</h1>
              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                Community
              </Badge>
            </div>

            <div
              className={`flex items-center gap-2 smooth-transition ${isNavOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
            >
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent smooth-transition">
                  <Home className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:bg-accent smooth-transition p-2"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:bg-accent smooth-transition p-2"
              onClick={() => setIsSelfProfileModalOpen(true)}
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 pb-24">
        {/* Stories Section - Instagram Style */}
        <div className="mb-6 sm:mb-8">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-2">
            {stories.map((story, index) => (
              <div
                key={story.id}
                className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer hover-scale smooth-transition"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => story.hasStory && handleStoryClick(story.id)}
              >
                <div className={`relative rounded-full p-0.5 ${story.hasStory ? 'bg-gradient-to-tr from-[#E11D48] via-[#2563EB] to-[#7C3AED]' : 'bg-muted'}`}>
                  <Avatar className="h-14 w-14 border-2 border-background">
                    <AvatarImage src={story.user.avatar} />
                    <AvatarFallback className="text-xs bg-muted">{story.user.initials}</AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-xs text-center truncate w-full professional-body max-w-[70px]">{story.user.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feed - Instagram Style */}
        <div className="space-y-6 max-h-screen overflow-y-auto pb-24">
          {posts.map((post) => (
            <Card key={post.id} className="bg-card/80 backdrop-blur-sm border-border fade-in-up hover-lift smooth-transition">
              <CardContent className="p-0">
                {/* Post Header */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{post.user.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4
                          className="font-semibold professional-heading text-sm cursor-pointer hover:text-primary smooth-transition"
                          onClick={() => handleProfileClick(post.user)}
                        >
                          {post.user.name}
                        </h4>
                        {post.user.isVerified && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            ✓
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground professional-body">{post.timeAgo}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground smooth-transition p-1">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Post Image */}
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full max-h-96 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handlePostImageClick(post.image)}
                  />
                )}

                {/* Post Actions */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500 smooth-transition p-0">
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500 smooth-transition p-0">
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500 smooth-transition p-0">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold mb-1">{post.likes} likes</p>
                  <p className="text-sm professional-body mb-2">
                    <span className="font-semibold">{post.user.name}</span> {post.content}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-accent smooth-transition">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Post Section - Instagram Style */}
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            size="lg"
            className="rounded-full h-14 w-14 bg-gradient-to-r from-[#E11D48] to-[#7C3AED] hover:from-[#DC2626] hover:to-[#6D28D9] shadow-lg hover-scale smooth-transition"
            onClick={() => setIsCreatePostModalOpen(true)}
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>

      {/* Story Viewer Modal */}
      <Dialog open={isStoryViewerOpen} onOpenChange={setIsStoryViewerOpen}>
        <DialogContent className="max-w-md mx-auto bg-card/95 backdrop-blur-sm border-border">
          <DialogHeader>
            <DialogTitle className="text-center professional-heading">
              {selectedStory && stories.find(s => s.id === selectedStory)?.user.name}
            </DialogTitle>
          </DialogHeader>
          <div className="relative">
            <div className="aspect-[9/16] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={selectedStory ? stories.find(s => s.id === selectedStory)?.user.avatar : ""} />
                  <AvatarFallback className="text-lg">
                    {selectedStory ? stories.find(s => s.id === selectedStory)?.user.initials : ""}
                  </AvatarFallback>
                </Avatar>
                <p className="text-muted-foreground professional-body">Story content would go here</p>
                <p className="text-sm text-muted-foreground mt-2">Tap to view next story</p>
              </div>
            </div>
            <div className="absolute top-2 left-2 right-2 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '30%' }}></div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseStoryViewer}
              className="absolute top-4 right-4 text-foreground hover:bg-accent/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Modal */}
      <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
        <DialogContent className="max-w-4xl mx-auto bg-card/95 backdrop-blur-sm border-border">
          <div className="relative">
            {selectedPostImage && (
              <img
                src={selectedPostImage}
                alt="Full size post content"
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseImageViewer}
              className="absolute top-4 right-4 text-foreground hover:bg-accent/50 bg-background/80 backdrop-blur-sm"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-md mx-auto bg-card/95 backdrop-blur-sm border-border">
          <DialogHeader>
            <DialogTitle className="text-center professional-heading">
              {selectedProfile?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={selectedProfile?.avatar} />
              <AvatarFallback className="text-lg">{selectedProfile?.initials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-semibold text-lg professional-heading">{selectedProfile?.name}</h3>
              <p className="text-sm text-muted-foreground professional-body">@{selectedProfile?.username}</p>
              {selectedProfile?.isVerified && (
                <Badge variant="secondary" className="mt-1">
                  ✓ Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-center professional-body">{selectedProfile?.bio}</p>
            <div className="flex gap-6 text-center">
              <div>
                <p className="font-semibold text-lg">{selectedProfile?.followers?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="font-semibold text-lg">{selectedProfile?.following?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full smooth-transition"
              onClick={handleCloseProfileModal}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="max-w-2xl mx-auto bg-card/95 backdrop-blur-sm border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="professional-heading">Search FitGram</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search users, posts, or hashtags..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((result, index) => (
                  <div key={index} className="p-3 border border-border rounded-lg hover:bg-accent/50 smooth-transition cursor-pointer">
                    {result.type === 'user' ? (
                      <div className="flex items-center gap-3" onClick={() => handleProfileClick(result)}>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={result.avatar} />
                          <AvatarFallback>{result.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold professional-heading">{result.name}</p>
                            {result.isVerified && <Badge variant="secondary" className="text-xs">✓</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">@{result.username}</p>
                        </div>
                      </div>
                    ) : (
                      <div onClick={() => handleProfileClick(result.user)}>
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={result.user.avatar} />
                            <AvatarFallback className="text-xs">{result.user.initials}</AvatarFallback>
                          </Avatar>
                          <p className="font-semibold text-sm professional-heading">{result.user.name}</p>
                          {result.user.isVerified && <Badge variant="secondary" className="text-xs">✓</Badge>}
                          <span className="text-xs text-muted-foreground">{result.timeAgo}</span>
                        </div>
                        <p className="text-sm professional-body line-clamp-2">{result.content}</p>
                        <div className="flex gap-1 mt-1">
                          {result.tags.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No results found for "{searchQuery}"</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Self Profile Modal */}
      <Dialog open={isSelfProfileModalOpen} onOpenChange={setIsSelfProfileModalOpen}>
        <DialogContent className="max-w-md mx-auto bg-card/95 backdrop-blur-sm border-border">
          <DialogHeader>
            <DialogTitle className="text-center professional-heading">
              My Profile
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={stories[0].user.avatar} />
              <AvatarFallback className="text-lg">{stories[0].user.initials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-semibold text-lg professional-heading">{stories[0].user.name}</h3>
              <p className="text-sm text-muted-foreground professional-body">@{stories[0].user.username}</p>
              {stories[0].user.isVerified && (
                <Badge variant="secondary" className="mt-1">
                  ✓ Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-center professional-body">{stories[0].user.bio}</p>
            <div className="flex gap-6 text-center">
              <div>
                <p className="font-semibold text-lg">{stories[0].user.followers?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="font-semibold text-lg">{stories[0].user.following?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1 smooth-transition"
                onClick={() => setIsCreatePostModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="flex-1 smooth-transition"
                onClick={() => setIsSelfProfileModalOpen(false)}
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="flex-1 smooth-transition"
                onClick={() => setIsSelfProfileModalOpen(false)}
              >
                Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Post Modal */}
      <Dialog open={isCreatePostModalOpen} onOpenChange={setIsCreatePostModalOpen}>
        <DialogContent className="max-w-md mx-auto bg-card/95 backdrop-blur-sm border-border">
          <DialogHeader>
            <DialogTitle className="text-center professional-heading">
              Create New Post
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={stories[0].user.avatar} />
                <AvatarFallback className="text-sm">{stories[0].user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  placeholder="What's on your mind?"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="w-full min-h-[100px] p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none professional-body"
                />
              </div>
            </div>
            {selectedImage && (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full max-h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImageUpload}
                className="flex-1"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Photo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Video className="h-4 w-4 mr-2" />
                Video
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreatePostModalOpen(false)
                  setPostText("")
                  setSelectedImage(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle post creation logic here
                  setIsCreatePostModalOpen(false)
                  setPostText("")
                  setSelectedImage(null)
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!postText.trim() && !selectedImage}
              >
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
