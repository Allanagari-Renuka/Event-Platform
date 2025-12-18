"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { CalendarIcon, LinkIcon, MapPin, DollarSign, Upload, X } from "lucide-react"
import { format } from "date-fns"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { eventFormSchema } from "@/lib/validator"
import { createEvent, updateEvent } from "@/lib/actions/event.actions"
import { CategoryDropdown } from "./category-dropdown"
import type { IEvent } from "@/lib/database/models/event.model"

type EventFormProps = {
  userId: string
  type: "Create" | "Update"
  event?: IEvent
  eventId?: string
}

export function EventForm({ userId, type, event, eventId }: EventFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(event?.imageUrl || null)

  const initialValues =
    event && type === "Update"
      ? {
          ...event,
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
          categoryId: event.category._id,
        }
      : {
          title: "",
          description: "",
          location: "",
          imageUrl: "",
          startDateTime: new Date(),
          endDateTime: new Date(),
          categoryId: "",
          price: "",
          isFree: false,
          url: "",
        }

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    setIsSubmitting(true)

    if (type === "Create") {
      try {
        const newEvent = await createEvent({
          event: values,
          userId,
          path: "/profile",
        })

        if (newEvent) {
          form.reset()
          router.push(`/events/${newEvent._id}`)
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (type === "Update") {
      if (!eventId) {
        router.back()
        return
      }

      try {
        const updatedEvent = await updateEvent({
          userId,
          event: { ...values, _id: eventId },
          path: `/events/${eventId}`,
        })

        if (updatedEvent) {
          router.push(`/events/${updatedEvent._id}`)
        }
      } catch (error) {
        console.error(error)
      }
    }

    setIsSubmitting(false)
  }

  // Simple file input handler using placeholder URL
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      // For demo purposes, use a placeholder URL
      // In production, you'd upload to a service like Vercel Blob
      form.setValue(
        "imageUrl",
        `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(file.name.split(".")[0])}`,
      )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Image Upload */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Image</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                  {imagePreview ? (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Event preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImagePreview(null)
                          field.onChange("")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-input">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} className="bg-input border-border" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategoryDropdown onChangeHandler={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your event..."
                  className="min-h-[120px] bg-input border-border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Event location or Online" {...field} className="pl-10 bg-input border-border" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date/Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date & Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-input border-border",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP p") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => date && field.onChange(date)}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <Input
                        type="time"
                        value={format(field.value, "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":")
                          const newDate = new Date(field.value)
                          newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                          field.onChange(newDate)
                        }}
                        className="bg-input border-border"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date & Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-input border-border",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP p") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => date && field.onChange(date)}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <Input
                        type="time"
                        value={format(field.value, "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":")
                          const newDate = new Date(field.value)
                          newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                          field.onChange(newDate)
                        }}
                        className="bg-input border-border"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      className="pl-10 bg-input border-border"
                      disabled={form.watch("isFree")}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-end space-x-3 space-y-0 pb-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                      if (checked) {
                        form.setValue("price", "0")
                      }
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">Free Ticket</FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* URL */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event URL</FormLabel>
              <FormControl>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="https://example.com" {...field} className="pl-10 bg-input border-border" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Submitting..." : `${type} Event`}
        </Button>
      </form>
    </Form>
  )
}
