
import { render_html_standalone } from '@phfaist/zoodb/zooflm';

const data = {
    title: "People DB home",
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
        // If we'd like to render other properties of `node`, especial FLM
        // content that is not marked as standalone-mode compatible, we should
        // use `zooflm.make_and_render_document` with a render callback.

        const node = zoodb.objects.node[node_id];
        const nodeHrefUrl = eleventy.hrefUrl(
            zoodb.zoo_object_permalink('node', node_id)
        );
        const nodeName = render_html_standalone(zoodb.objects.node[node_id].name);

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
