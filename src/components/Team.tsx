import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Member = {
  name: string;
  role: string;
  bio: string;
  link: string;
};

const members: Member[] = [
  { name: "NBNNN", role: "Founder/Dev", bio: "Visionary behind NBNNN.", link:"https://x.com/NutBeforeNNN" },
  { name: "Comming", role: "Comming", bio: "Comming", link:"" },
  { name: "Soon", role: "Soon", bio: "Soon.", link:"" },
];

export const Team = () => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4">Team & Founders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <Card key={m.name}>
            <CardHeader>
              <CardTitle>{m.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{m.role}</div>
              <p className="mt-2">{m.bio}</p>
              <p className="mt-2"><a href={m.link} target="_blank" rel="noopener noreferrer">{m.link}</a></p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Team;


