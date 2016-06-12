package no.iskald.payup;

import com.enonic.xp.content.*;
import com.enonic.xp.data.PropertyPath;
import com.enonic.xp.data.PropertySet;
import com.enonic.xp.node.NodeId;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.util.Reference;

/**
 * Created by lasse on 01.06.16.
 */
public class OrderUtil implements ScriptBean {
    private ContentService contentService;

    public void addToOrder(String orderId, Long quantity, String productId) {
        Content orderContent = contentService.getById(ContentId.from(orderId));

        Iterable<PropertySet> itemList = orderContent.getData().getSets("items");

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

        final Content result = this.contentService.update( params );
    }

    @Override
    public void initialize(BeanContext context) {
        this.contentService = context.getService( ContentService.class ).get();
    }
}
