export default function AuthTitle(props: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1>{props.title}</h1>
      <p>{props.subtitle}</p>
    </div>
  );
}
