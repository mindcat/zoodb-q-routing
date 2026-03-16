import { render_html_standalone } from '@phfaist/zoodb/zooflm';

const data = {
    title: "Quantum Routing Zoo Home", // <-- Updated title
    tags: [ 'allPages' ],
    eleventyComputed: {
        // ---
        // injection hack to get correct page date property!
        // https://github.com/11ty/eleventy/issues/2199#issuecomment-1027362151
        date: (data) => {
            data.page.date = new Date(
                data.zoodb.zoo_gitlastmodified_processor.get_latest_modification_date()
            );
            return data.page.date;
        }
        // ---
    }
};

async function render(data)
{
    const eleventy = this;
    const zoodb = data.zoodb;

    let content = `
<p>Routing Algorithm List (prettier render coming when enough data to make a complex graph has been added):</p>`;

    content += `
<ul>`;

    const node_id_list = [ ...Object.keys(zoodb.objects.node) ];
    node_id_list.sort();

    for (const node_id of node_id_list) {
        const node = zoodb.objects.node[node_id];

        // Get the raw permalink from ZooDb
        const rawPermalink = zoodb.zoo_object_permalink('node', node_id);

        // Use Eleventy's built-in URL filter to safely apply the pathPrefix
        // const nodeHrefUrl = eleventy.url(rawPermalink);
        const nodeHrefUrl = rawPermalink;

        const nodeName = render_html_standalone(node.name);

        content += `
<li><a href="${ nodeHrefUrl }">${ nodeName }</a></li>
`;
    }

    content += `
</ul>
`;
    return content;
};

export default { data, render, };
