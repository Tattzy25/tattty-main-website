import { ImageGallery, type ImageObject } from "@/components/image-gallery"
import { SummaryDisplay } from "@/components/summary-display"
import { type QuestionCard } from "@/data/tattty-qs/types"
import { type Card7Category } from "@/data/tattty-card-7/types"

interface RightSidePanelProps {
  // Card type flags
  isCard7: boolean
  isCard8: boolean
  
  // Card 7 data
  card7Categories: Card7Category[]
  categoryImages: {[key: string]: ImageObject[]}
  selectedImages: {[key: string]: ImageObject[]}
  onImageSelect: (category: string, image: ImageObject) => void
  
  // Card 8 data
  sentMessages: string[]
  cardData: QuestionCard[]
}

export function RightSidePanel({
  isCard7,
  isCard8,
  card7Categories,
  categoryImages,
  selectedImages,
  onImageSelect,
  sentMessages,
  cardData,
}: RightSidePanelProps) {
  // Card 7: Show image galleries for all categories
  if (isCard7) {
    return (
      <div className="w-full lg:w-[45%] flex flex-col gap-6 p-4 pt-32 overflow-y-auto max-h-screen hide-scrollbar">
        {card7Categories.map((category) => (
          <ImageGallery
            key={category.id}
            images={categoryImages[category.id] || []}
            selectedImages={selectedImages[category.id] || []}
            onImageSelect={(image) => onImageSelect(category.id, image)}
            title={category.label}
          />
        ))}
      </div>
    )
  }

  // Card 8: Show summary of all selections
  if (isCard8) {
    return (
      <div className="w-full lg:w-[45%] flex flex-col p-4 pt-20 lg:pt-4 overflow-y-auto max-h-screen hide-scrollbar">
        <SummaryDisplay
          sentMessages={sentMessages}
          selectedImages={selectedImages}
          cardData={cardData}
        />
      </div>
    )
  }

  // Questions 1-6: Show nothing
  return null
}
