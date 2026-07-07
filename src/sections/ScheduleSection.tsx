import type { WeddingConfig } from "../types/wedding";
import { SectionHeading } from "../components/SectionHeading";

type ScheduleSectionProps = {
  config: WeddingConfig;
};

export function ScheduleSection({ config }: ScheduleSectionProps) {
  const schedule = [...config.schedule].filter((item) => item.enabled).sort((a, b) => a.order - b.order);
  const hasTimes = schedule.some((item) => item.time);

  return (
    <section className="section section--sand reveal" id="schedule" aria-labelledby="schedule-title">
      <div className="page-shell">
        <SectionHeading eyebrow="Program" title="Akşamın Akışı">
          Saatler kesinleştiğinde aynı akış kendiliğinden zaman çizelgesine dönüşecek.
        </SectionHeading>
        <div className="schedule-layout">
          <div className="schedule-illustration" aria-hidden="true">
            <span className="schedule-illustration__string" />
            <span className="schedule-illustration__lantern schedule-illustration__lantern--one" />
            <span className="schedule-illustration__lantern schedule-illustration__lantern--two" />
            <span className="schedule-illustration__lantern schedule-illustration__lantern--three" />
            <span className="schedule-illustration__floor" />
            <span className="schedule-illustration__shoe schedule-illustration__shoe--left" />
            <span className="schedule-illustration__shoe schedule-illustration__shoe--right" />
            <span className="painted-flower painted-flower--rose" />
            <span className="painted-flower painted-flower--blue" />
            <span className="painted-leaf" />
          </div>
          <ol className={hasTimes ? "schedule schedule--timed" : "schedule"}>
            {schedule.map((item, index) => (
              <li key={item.id} className={`schedule__item schedule__item--${(index % 3) + 1}`}>
                <span className="schedule__number">{String(item.order).padStart(2, "0")}</span>
                <span className="schedule__pulse" aria-hidden="true" />
                <span className="schedule__spark" aria-hidden="true" />
                <div>
                  <h3>{item.title}</h3>
                  {item.description ? <p>{item.description}</p> : null}
                </div>
                {item.time ? <time>{item.time}</time> : null}
              </li>
            ))}
          </ol>
        </div>
        <div className="notes-row" />
      </div>
    </section>
  );
}
