"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, X, Send, Settings, Plus, Trash2, GripVertical } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  provider: string
  model: string
}

interface AIProvider {
  id: string
  name: string
  endpoint: string
  apiKeyEnv: string
  models: AIModel[]
}

interface AIModel {
  id: string
  name: string
  maxTokens: number
  temperature: number
}

const STORAGE_KEY = "tattty_ai_providers"
const POSITION_KEY = "tattty_chat_position"
const SIZE_KEY = "tattty_chat_size"

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProviderId, setSelectedProviderId] = useState("")
  const [selectedModelId, setSelectedModelId] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [providers, setProviders] = useState<AIProvider[]>([])
  
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ width: 384, height: 600 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [hasMovedWhileDragging, setHasMovedWhileDragging] = useState(false)
  
  const cardRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const [newProvider, setNewProvider] = useState({
    name: "",
    endpoint: "",
    apiKeyEnv: ""
  })

  const [newModel, setNewModel] = useState({
    providerId: "",
    id: "",
    name: "",
    maxTokens: 4096,
    temperature: 0.7
  })

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setProviders(JSON.parse(saved))
      } catch (e) {
        setProviders([])
      }
    }

    const savedPosition = localStorage.getItem(POSITION_KEY)
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition))
      } catch (e) {
        setPosition({ x: window.innerWidth - 400, y: window.innerHeight - 650 })
      }
    } else {
      setPosition({ x: window.innerWidth - 400, y: window.innerHeight - 650 })
    }

    const savedSize = localStorage.getItem(SIZE_KEY)
    if (savedSize) {
      try {
        setSize(JSON.parse(savedSize))
      } catch (e) {
        setSize({ width: 384, height: 600 })
      }
    }
  }, [])

  useEffect(() => {
    if (providers.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(providers))
    }
  }, [providers])

  useEffect(() => {
    localStorage.setItem(POSITION_KEY, JSON.stringify(position))
  }, [position])

  useEffect(() => {
    localStorage.setItem(SIZE_KEY, JSON.stringify(size))
  }, [size])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setHasMovedWhileDragging(true)
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        
        const maxX = isOpen ? window.innerWidth - size.width : window.innerWidth - 56
        const maxY = isOpen ? window.innerHeight - size.height : window.innerHeight - 56
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        })
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        
        const newWidth = Math.max(320, Math.min(resizeStart.width + deltaX, window.innerWidth - position.x))
        const newHeight = Math.max(400, Math.min(resizeStart.height + deltaY, window.innerHeight - position.y))
        
        setSize({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setTimeout(() => setHasMovedWhileDragging(false), 100)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragStart, resizeStart, position, size, isOpen])

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    const clickX = e.clientX
    const clickY = e.clientY
    
    setDragStart({
      x: clickX - position.x,
      y: clickY - position.y
    })
    setIsDragging(true)
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    })
    setIsResizing(true)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    if (!hasMovedWhileDragging) {
      setIsOpen(true)
    }
  }

  const selectedProvider = providers.find(p => p.id === selectedProviderId)
  const selectedModel = selectedProvider?.models.find(m => m.id === selectedModelId)

  const addProvider = () => {
    if (!newProvider.name || !newProvider.endpoint || !newProvider.apiKeyEnv) return

    const providerId = `${Date.now()}-${newProvider.name.toLowerCase().replace(/\s+/g, '-')}`
    
    const provider: AIProvider = {
      id: providerId,
      name: newProvider.name,
      endpoint: newProvider.endpoint,
      apiKeyEnv: newProvider.apiKeyEnv,
      models: []
    }

    setProviders([...providers, provider])
    setNewProvider({ name: "", endpoint: "", apiKeyEnv: "" })
  }

  const removeProvider = (providerId: string) => {
    const updated = providers.filter(p => p.id !== providerId)
    setProviders(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    if (selectedProviderId === providerId) {
      setSelectedProviderId("")
      setSelectedModelId("")
    }
  }

  const addModel = () => {
    if (!newModel.providerId || !newModel.id || !newModel.name) return

    const updated = providers.map(p => {
      if (p.id === newModel.providerId) {
        return {
          ...p,
          models: [...p.models, {
            id: newModel.id,
            name: newModel.name,
            maxTokens: newModel.maxTokens,
            temperature: newModel.temperature
          }]
        }
      }
      return p
    })

    setProviders(updated)
    setNewModel({
      providerId: "",
      id: "",
      name: "",
      maxTokens: 4096,
      temperature: 0.7
    })
  }

  const removeModel = (providerId: string, modelId: string) => {
    const updated = providers.map(p => {
      if (p.id === providerId) {
        return {
          ...p,
          models: p.models.filter(m => m.id !== modelId)
        }
      }
      return p
    })
    setProviders(updated)
    if (selectedModelId === modelId) {
      setSelectedModelId("")
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !selectedProviderId || !selectedModelId || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
      provider: selectedProvider?.name || "",
      model: selectedModel?.name || ""
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(m => ({
            role: m.role,
            content: m.content
          })),
          providerId: selectedProviderId,
          modelId: selectedModelId,
          provider: selectedProvider,
          model: selectedModel
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "API request failed")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        provider: selectedProvider?.name || "",
        model: selectedModel?.name || ""
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "Request failed"}`,
        timestamp: new Date(),
        provider: "System",
        model: "Error"
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        ref={buttonRef}
        onMouseDown={handleDragStart}
        onClick={handleButtonClick}
        size="icon"
        className="fixed h-14 w-14 rounded-full shadow-lg cursor-move select-none bg-orange-500 hover:bg-orange-600 text-white hover:scale-110 transition-all duration-300"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          touchAction: "none"
        }}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card 
      ref={cardRef}
      className="fixed shadow-2xl flex flex-col select-none bg-black/90 backdrop-blur-md rounded-[2rem] overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        touchAction: "none"
      }}
    >
      <CardHeader 
        className="flex flex-row items-center justify-between space-y-0 pb-4 cursor-move border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-transparent" 
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-orange-400" />
          <CardTitle className="text-lg font-semibold text-white">AI Assistant</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-orange-500/20 hover:text-orange-400 text-white/70">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>AI Provider Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Providers & Models</h3>
                  {providers.length === 0 && (
                    <p className="text-sm text-muted-foreground">No providers configured. Add one below.</p>
                  )}
                  {providers.map(provider => (
                    <div key={provider.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-base">{provider.name}</p>
                          <p className="text-sm text-muted-foreground break-all">{provider.endpoint}</p>
                          <p className="text-xs text-muted-foreground mt-1">Env: {provider.apiKeyEnv}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeProvider(provider.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="ml-4 space-y-2 border-l-2 pl-4">
                        <p className="text-sm font-medium">Models:</p>
                        {provider.models.length === 0 && (
                          <p className="text-xs text-muted-foreground">No models added</p>
                        )}
                        {provider.models.map(model => (
                          <div key={model.id} className="flex items-center justify-between bg-muted p-2 rounded">
                            <div>
                              <p className="text-sm font-medium">{model.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {model.id} • {model.maxTokens} tokens • temp {model.temperature}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeModel(provider.id, model.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t pt-6">
                  <h3 className="font-semibold text-lg">Add Provider</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="provider-name">Provider Name</Label>
                      <Input
                        id="provider-name"
                        value={newProvider.name}
                        onChange={e => setNewProvider({...newProvider, name: e.target.value})}
                        placeholder="Groq, Anthropic, OpenAI, etc."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="provider-endpoint">API Endpoint URL</Label>
                      <Input
                        id="provider-endpoint"
                        value={newProvider.endpoint}
                        onChange={e => setNewProvider({...newProvider, endpoint: e.target.value})}
                        placeholder="https://api.groq.com/openai/v1/chat/completions"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="provider-key-env">Environment Variable Name</Label>
                      <Input
                        id="provider-key-env"
                        value={newProvider.apiKeyEnv}
                        onChange={e => setNewProvider({...newProvider, apiKeyEnv: e.target.value})}
                        placeholder="GROQ_API_KEY"
                      />
                    </div>
                    <Button onClick={addProvider} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Provider
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-6">
                  <h3 className="font-semibold text-lg">Add Model to Provider</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="model-provider">Select Provider</Label>
                      <Select 
                        value={newModel.providerId} 
                        onValueChange={v => setNewModel({...newModel, providerId: v})}
                      >
                        <SelectTrigger id="model-provider">
                          <SelectValue placeholder="Choose provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {providers.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="model-id">Model ID</Label>
                      <Input
                        id="model-id"
                        value={newModel.id}
                        onChange={e => setNewModel({...newModel, id: e.target.value})}
                        placeholder="llama-3.3-70b-versatile"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="model-name">Model Display Name</Label>
                      <Input
                        id="model-name"
                        value={newModel.name}
                        onChange={e => setNewModel({...newModel, name: e.target.value})}
                        placeholder="Llama 3.3 70B"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="max-tokens">Max Tokens</Label>
                        <Input
                          id="max-tokens"
                          type="number"
                          value={newModel.maxTokens}
                          onChange={e => setNewModel({...newModel, maxTokens: parseInt(e.target.value) || 4096})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="temperature">Temperature</Label>
                        <Input
                          id="temperature"
                          type="number"
                          step="0.1"
                          min="0"
                          max="2"
                          value={newModel.temperature}
                          onChange={e => setNewModel({...newModel, temperature: parseFloat(e.target.value) || 0.7})}
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={addModel} 
                      className="w-full"
                      disabled={!newModel.providerId}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Model
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)}
            className="hover:bg-red-500/20 hover:text-red-400 text-white/70"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 bg-black/50">
        <div className="flex gap-2">
          <Select value={selectedProviderId} onValueChange={setSelectedProviderId}>
            <SelectTrigger className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-orange-500/50 transition-colors">
              <SelectValue placeholder="Select Provider" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-md border-white/10">
              {providers.map(provider => (
                <SelectItem 
                  key={provider.id} 
                  value={provider.id}
                  className="text-white hover:bg-orange-500/20 focus:bg-orange-500/20"
                >
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={selectedModelId} 
            onValueChange={setSelectedModelId}
            disabled={!selectedProviderId}
          >
            <SelectTrigger className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-orange-500/50 transition-colors disabled:opacity-50">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-md border-white/10">
              {selectedProvider?.models.map(model => (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  className="text-white hover:bg-orange-500/20 focus:bg-orange-500/20"
                >
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col gap-1 ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-orange-500 text-white"
                      : "bg-white/10 text-white border border-white/10"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-white/50">
                  {message.provider} - {message.model} • {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="rounded-2xl px-4 py-2 bg-white/10 border border-white/10">
                  <p className="text-sm text-white">Processing...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask anything..."
            disabled={isLoading || !selectedProviderId || !selectedModelId}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 hover:bg-white/10 hover:border-orange-500/50 focus:border-orange-500 transition-colors"
          />
          <Button 
            onClick={sendMessage} 
            size="icon"
            disabled={isLoading || !selectedProviderId || !selectedModelId || !input.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize"
          onMouseDown={handleResizeStart}
          style={{
            background: "linear-gradient(135deg, transparent 0%, transparent 50%, rgb(249 115 22 / 0.5) 50%, rgb(249 115 22 / 0.5) 100%)",
          }}
        />
      </CardContent>
    </Card>
  )
}
