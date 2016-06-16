package no.iskald.payup;

import com.enonic.xp.content.*;
import com.enonic.xp.context.Context;
import com.enonic.xp.context.ContextAccessor;
import com.enonic.xp.context.ContextBuilder;
import com.enonic.xp.data.PropertyPath;
import com.enonic.xp.data.PropertySet;
import com.enonic.xp.data.PropertyTree;
import com.enonic.xp.lib.content.PublishContentHandler;
import com.enonic.xp.node.NodeId;
import com.enonic.xp.schema.content.ContentTypeName;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.util.Reference;
import com.google.gson.GsonBuilder;


public class OrderUtil implements ScriptBean {
    private ContentService contentService;

    public String addToOrder(String orderId, Long quantity, String productId) {
        Content orderContent = contentService.getById(ContentId.from(orderId));

        ContentEditor editor;

        editor = edit -> {
            PropertySet set = new PropertySet();
            set.addReference("product", Reference.from(productId));
            set.addLong("quantity", quantity);
            edit.data.addSet("items", set);
        };

        final UpdateContentParams params = new UpdateContentParams();
        params.contentId( orderContent.getId() );
        params.editor( editor );

        return this.contentService.update(params).getId().toString();
    }

    public String createOrder(String cartId) {
        Content cartContent = contentService.getById(ContentId.from(cartId));
        CreateContentParams.Builder params = CreateContentParams.create();

        PropertyTree tree = new PropertyTree();

        for(PropertySet cartItemSet : cartContent.getData().getSets("items")) {
            PropertySet set = new PropertySet();
            set.addReference("product", Reference.from(cartItemSet.getString("product")));
            set.addLong("quantity", cartItemSet.getLong("quantity"));
            tree.addSet("items", set);
        }

        tree.addReference("customer", cartContent.getData().getReference("customer"));

        params.parent(ContentPath.from("/payup/orders"));
        params.type(ContentTypeName.from("no.iskald.payup.store:order"));
        params.contentData(tree);
        params.name(ContentName.uniqueUnnamed());
        params.displayName("TESTORDER1234");

        return this.contentService.create(params.build()).getId().toString();
    }

    @Override
    public void initialize(BeanContext context) {
        this.contentService = context.getService( ContentService.class ).get();
    }
}
