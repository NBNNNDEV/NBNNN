import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I buy $NBNNN?",
    a: "Use the link above to go to the DEX or launchpad once live.",
  },
  {
    q: "What is the utility?",
    a: "Have fun, track nuts streaks, and join the community. More coming soon.",
  },
  {
    q:"Does the wall of shame reset ?",
    a:"No, You are on this wall forever."
  }
];

export const FAQ = () => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">FAQ</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;


