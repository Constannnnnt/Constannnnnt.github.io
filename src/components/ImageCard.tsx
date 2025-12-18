interface ImageCardProps {
  src: string;
  alt: string;
  caption: string;
}

export const ImageCard = ({ src, alt, caption }: ImageCardProps) => {
  return (
    <div className="group">
      <div className="overflow-hidden rounded-lg mb-3">
        <img
          src={src}
          alt={alt}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p className="text-sm text-muted-foreground font-body">{caption}</p>
    </div>
  );
};
