/** Loading skeleton shaped like a tutor card (shimmer) */
export function CardSkeleton() {
  return (
    <div className="sk" aria-hidden="true">
      <div className="sk-top">
        <i className="sk-ph" />
        <div className="sk-l">
          <i style={{ width: "60%", height: 16 }} />
          <i style={{ width: "40%" }} />
          <i style={{ width: "80%" }} />
        </div>
      </div>
      <i style={{ width: "100%" }} />
      <i style={{ width: "90%" }} />
      <i style={{ width: "70%" }} />
      <i style={{ width: "100%", height: 44, borderRadius: 12 }} />
    </div>
  );
}

export function Skeletons({ n = 4 }: { n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </>
  );
}
