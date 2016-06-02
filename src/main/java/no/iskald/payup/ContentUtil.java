package no.iskald.payup;

import com.enonic.xp.content.*;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.util.Reference;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by lasse on 28.05.16.
 */
public class ContentUtil implements ScriptBean {
    private ContentService contentService;

    public void appendContent(String onContent, String field, String appendKey) {
        Content c = contentService.getById(ContentId.from(onContent));

        ContentEditor editor = edit -> {
            edit.data.addReference(field, Reference.from(appendKey));
        };

        final UpdateContentParams params = new UpdateContentParams();
        params.contentId( c.getId() );
        params.editor( editor );

        final Content result = this.contentService.update( params );
    }

    public void removeContent(String fromContent, String field, String removeKey) {
        Content c = contentService.getById(ContentId.from(fromContent));

        ContentEditor editor = edit -> {
            List<Reference> keepReferences = new ArrayList<>();
            for (Reference r : edit.data.getReferences(field)) {
                if (!r.getNodeId().toString().equals(removeKey)) {
                    keepReferences.add(r);
                }
            }

            edit.data.removeProperties(field);
            for(Reference addRef : keepReferences) {
                edit.data.addReference(field, addRef);
            }
        };

        final UpdateContentParams params = new UpdateContentParams();
        params.contentId( c.getId() );
        params.editor( editor );

        final Content result = this.contentService.update( params );
    }

    @Override
    public void initialize(BeanContext context) {
        this.contentService = context.getService( ContentService.class ).get();
    }
}
