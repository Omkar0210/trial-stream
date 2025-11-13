import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MessageSquare, Plus, Search, Tags } from "lucide-react";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { VapiVoiceAssistant } from "@/components/VapiVoiceAssistant";
import { AIChatAssistant } from "@/components/AIChatAssistant";
import { useToast } from "@/hooks/use-toast";

interface ForumPost {
  id: string;
  title: string;
  category: string;
  author: string;
  authorType: "patient" | "researcher";
  content: string;
  replies: number;
  date: string;
}

const Forum = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userType, setUserType] = useState<"patient" | "researcher">("patient");
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", category: "", content: "", tags: "" });

  const availableCategories = [
    "General Discussion",
    "Research Questions",
    "Clinical Trials",
    "Treatment Options",
    "Patient Experience",
    "Collaboration Opportunities"
  ];

  useEffect(() => {
    const type = localStorage.getItem("userType") as "patient" | "researcher";
    setUserType(type || "patient");

    // Mock forum posts
    const mockPosts: ForumPost[] = [
      {
        id: "1",
        title: "Experiences with Deep Brain Stimulation?",
        category: "Parkinson's Disease",
        author: "John Smith",
        authorType: "patient",
        content: "I'm considering DBS therapy and would love to hear from others who have tried it...",
        replies: 12,
        date: "2025-01-10"
      },
      {
        id: "2",
        title: "Latest Research on Stem Cell Therapy",
        category: "Parkinson's Disease",
        author: "Dr. Sarah Chen",
        authorType: "researcher",
        content: "Here's a summary of recent findings in stem cell therapy for movement disorders...",
        replies: 8,
        date: "2025-01-09"
      },
      {
        id: "3",
        title: "Diet and Breast Cancer Prevention",
        category: "Breast Cancer",
        author: "Jane Doe",
        authorType: "patient",
        content: "What dietary changes have you found helpful?",
        replies: 15,
        date: "2025-01-08"
      },
      {
        id: "4",
        title: "Clinical Trial Enrollment Tips",
        category: "General",
        author: "Dr. Michael Brown",
        authorType: "researcher",
        content: "Guide for patients considering clinical trial participation...",
        replies: 6,
        date: "2025-01-07"
      }
    ];
    setPosts(mockPosts);
  }, []);

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.category || !newPost.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    const userData = localStorage.getItem(userType === "patient" ? "patientData" : "researcherData");
    const name = userData ? JSON.parse(userData).name : "Anonymous";

    const post: ForumPost = {
      id: Date.now().toString(),
      ...newPost,
      author: name,
      authorType: userType,
      replies: 0,
      date: new Date().toISOString().split('T')[0]
    };

    setPosts([post, ...posts]);
    setNewPost({ title: "", category: "", content: "", tags: "" });
    setIsNewPostOpen(false);
    toast({
      title: "Post Created",
      description: "Your post has been published to the forum.",
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(posts.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <NavigationDrawer userType={userType} />
      <header className="bg-card border-b shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold">Discussion Forums</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Search and Filter */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Discussion</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="Post Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                  <Select 
                    value={newPost.category} 
                    onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="What would you like to discuss?"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={6}
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Tags className="w-4 h-4" />
                      Tags (comma separated)
                    </label>
                    <Input
                      placeholder="e.g., parkinson's, stem cell, clinical trial"
                      value={newPost.tags}
                      onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreatePost} className="flex-1">
                      Publish Post
                    </Button>
                    <Button variant="outline" onClick={() => setIsNewPostOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Forum Posts */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No discussions found. Be the first to start one!</p>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="p-6 hover:shadow-medium transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {post.content}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <Badge variant={post.authorType === "patient" ? "outline" : "default"}>
                        {post.authorType === "patient" ? "Patient" : "Researcher"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">by {post.author}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{post.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{post.replies}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <VapiVoiceAssistant />
      <AIChatAssistant />
    </div>
  );
};

export default Forum;
