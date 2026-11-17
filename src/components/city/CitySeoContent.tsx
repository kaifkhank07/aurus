import { Container } from "@/components/ui/Primitives";

interface CitySeoContentProps {
  title: string;
  paragraphs: string[];
}

/**
 * Long-form SEO copy shown under the residence grid on listing pages.
 * Rendered on the server so the text is in the page HTML.
 */
export function CitySeoContent({ title, paragraphs }: CitySeoContentProps) {
  if (!title && paragraphs.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 lg:py-14 border-t border-ink/10">
      <Container>
        <div className="max-w-4xl">
          {title && (
            <h2 className="font-sans text-[22px] sm:text-[28px] lg:text-[32px] font-medium leading-tight tracking-[-0.02em] text-ink">
              {title}
            </h2>
          )}
          <div className="mt-4 sm:mt-5 space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="font-sans font-normal text-[15px] sm:text-[17px] leading-[1.6] text-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CitySeoContent;
