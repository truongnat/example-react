export function Welcome(props) {
  return (
    <div>
      {Array.from(new Array(10), (v, k) => k).map((i) => (
        <div key={i}>{i}</div>
      ))}
    </div>
  );
}
