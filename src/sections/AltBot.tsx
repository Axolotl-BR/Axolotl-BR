import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { bot, links } from '../data/site'
import axolote from '../assets/images/axolote.png'

export function AltBot() {
  return (
    <Section
      id="bot"
      eyebrow="bot"
      title={<>o bot do servidor.</>}
      lead={bot.desc}
      className="bot"
    >
      <Reveal>
        <div className="bot-card panel">
          <img
            src={axolote}
            alt="avatar do ALT BOT"
            width={56}
            height={56}
            className="bot-avatar"
            loading="lazy"
            decoding="async"
          />
          <div className="bot-body">
            <div className="bot-top">
              <h3 className="bot-name mono">{bot.name}</h3>
              <span className="tag">{bot.status}</span>
            </div>
            <p className="bot-role">{bot.role}</p>
            <ol className="bot-feats">
              {bot.features.map((feat, i) => (
                <li key={feat} className="bot-feat">
                  <span className="mono bot-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {feat}
                </li>
              ))}
            </ol>
            <div className="bot-actions">
              <a
                href={links.discord}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
              >
                entrar no discord
              </a>
              <p className="mono bot-note">{bot.note}</p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
