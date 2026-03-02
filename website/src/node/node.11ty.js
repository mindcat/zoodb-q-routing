import {
    render_text_standalone,
    make_render_shorthands,
    make_and_render_document,
} from '@phfaist/zoodb/zooflm';
import { sqzhtml } from '@phfaist/zoodb/util/sqzhtml';


async function data()
{
    return {
        pagination: {
            data: 'zoodb.objects.node', // <-- Changed from person
            size: 1,
            resolve: 'values',
            addAllPagesToCollections: true,
            alias: 'node', // <-- Changed from person
        },
        date: '2000-01-01', // should be ignored
        tags: ['allPages', 'node'], // <-- Changed from person
        eleventyComputed: {
            permalink: (data) =>
                data.zoodb.zoo_object_permalink('node', data.node.node_id) + '.html',
            title: (data) => render_text_standalone(data.node.name),

            node_name: (data) => render_text_standalone(data.node.name),

            date: (data) => {
                // injection hack to get correct page date property!
                // https://github.com/11ty/eleventy/issues/2199#issuecomment-1027362151
                data.page.date = new Date(data.node._zoodb.git_last_modified_date);
                return data.page.date;
            },
        },
    };
};

async function render(data)
{
    const { node, zoodb } = data; // <-- Changed from person

    const zoo_flm_environment = zoodb.zoo_flm_environment;

    const render_doc_fn = (render_context) => {

        const { ne, rdr, rdrblock, ref } = make_render_shorthands({ render_context });

        let s = '';

        // Updated HTML to reflect your Quantum Routing Algorithm fields
        s += sqzhtml`
<article>
<h1>${ rdr(node.name) }</h1>

${ node.paradigm ? sqzhtml`<p><strong>Paradigm:</strong> ${ rdr(node.paradigm) }</p>` : '' }
${ node.complexity ? sqzhtml`<p><strong>Complexity:</strong> ${ rdr(node.complexity) }</p>` : '' }

<h2>Summary</h2>
<div style="margin: 1.5rem 0px">${ rdrblock(node.summary) }</div>`;

        const relations = node.relations ?? {};

        // Render "Baselines" if they exist
        if (relations.baselines != null && relations.baselines.length) {
            s += sqzhtml`
<h2>Baselines (Compared Against)</h2>
<ul>`;
            for (const baseline of relations.baselines) {
                s += sqzhtml`
    <li>${ ref('node', baseline.node_id) }</li>
  `;
            }
            s += sqzhtml`
</ul>
`;
        }

        // Render "Improves Upon" if they exist
        if (relations.improves_upon != null && relations.improves_upon.length) {
            s += sqzhtml`
<h2>Improves Upon</h2>
<ul>`;
            for (const improvement of relations.improves_upon) {
                s += sqzhtml`
    <li>${ ref('node', improvement.node_id) }</li>
  `;
            }
            s += sqzhtml`
</ul>
`;
        }

        s += sqzhtml`
<RENDER_ENDNOTES/>

<p class="last-edit">Last modified: ${ data.page.date.toString() }</p>
</article>`;

        return s;
    }

    return make_and_render_document({
        zoo_flm_environment,
        render_doc_fn,
        //doc_metadata: {},
        render_endnotes: {
            annotations: ['sectioncontent'],
        }
    });
};


export default { data, render, };
