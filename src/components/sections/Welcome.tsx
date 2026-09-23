import { COUPLE } from '../../data/wedding';
import { SectionHeading } from '../ui/SectionHeading';

export function Welcome() {
  return (
    <section id="boas-vindas" className="px-6 py-24 md:px-10 md:py-32">
      <SectionHeading eyebrow="Um prólogo" title="As páginas que escrevemos juntos" />

      <div className="mx-auto mt-12 max-w-[65ch] space-y-6 text-lg leading-relaxed text-muted">
        <p className="first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-clay">
          Há momentos que, quando vividos, parecem comuns: uma sessão de cinema, uma viagem de carro, uma conversa que
          atravessa a noite. Mas o tempo, como um bom editor, junta esses recortes e revela uma história maior.
        </p>
        <p>
          A nossa não foi escrita com pressa. Foi tecida nas alegrias do dia a dia, nos silêncios confortáveis e na
          certeza crescente de que tínhamos encontrado o nosso lugar de paz um no outro.
        </p>
        <p>
          Este site é um pedaço dessa história e um convite para o capítulo mais importante. Veja por onde passamos,
          nossas memórias e prepare-se para celebrar com a gente.
        </p>
      </div>

      <p className="mt-12 text-center">
        <span className="eyebrow block">Com amor,</span>
        <span className="mt-2 block font-serif text-5xl text-clay italic">
          {COUPLE.groomNickname} &amp; {COUPLE.brideNickname}
        </span>
      </p>
    </section>
  );
}
